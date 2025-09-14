import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../prisma/prisma.service'
import { UsersService } from '../users/users.service'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { LoginDto } from './dto/login.dto'
import { VerifyOtpDto } from './dto/verify-otp.dto'
import { RequestOtpDto } from './dto/request-otp.dto'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async requestOtp(requestOtpDto: RequestOtpDto) {
    const { email, phone } = requestOtpDto

    if (!email && !phone) {
      throw new BadRequestException('Email ou téléphone requis')
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedOtp = await bcrypt.hash(otp, 10)

    // Store OTP in database (in production, use Redis with TTL)
    const otpData = {
      identifier: email || phone,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    }

    // TODO: Send OTP via email/SMS
    console.log(`OTP for ${email || phone}: ${otp}`)

    return {
      message: 'OTP envoyé avec succès',
      identifier: email || phone,
      expiresIn: 600, // 10 minutes in seconds
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { identifier, otp, name } = verifyOtpDto

    // In production, verify OTP from Redis
    // For demo purposes, accept any 6-digit OTP
    if (!/^\d{6}$/.test(otp)) {
      throw new UnauthorizedException('Code OTP invalide')
    }

    // Check if user exists
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier },
        ],
      },
    })

    // Create user if doesn't exist
    if (!user) {
      if (!name) {
        throw new BadRequestException('Nom requis pour la création de compte')
      }

      const createUserDto: CreateUserDto = {
        email: identifier.includes('@') ? identifier : undefined,
        phone: !identifier.includes('@') ? identifier : undefined,
        name,
      }

      user = await this.usersService.create(createUserDto)
    }

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    }

    const token = this.jwtService.sign(payload)

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        locale: user.locale,
      },
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides')
    }

    // For demo purposes, skip password verification
    // In production, verify password hash

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    }

    const token = this.jwtService.sign(payload)

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        locale: user.locale,
      },
    }
  }

  async validateUser(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    })

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé')
    }

    return user
  }
}