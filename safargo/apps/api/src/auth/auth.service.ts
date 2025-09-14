import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'nestjs-prisma'
import { User } from '@prisma/client'
import { OtpService } from './otp.service'
import { RequestOtpDto, VerifyOtpDto } from '@safargo/shared'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async requestOtp(dto: RequestOtpDto) {
    const { email, phone, locale } = dto

    // Check if user exists
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          phone ? { phone } : undefined,
        ].filter(Boolean),
      },
    })

    // Create user if doesn't exist
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: email || '',
          phone,
          name: email?.split('@')[0] || phone || 'User',
          locale,
        },
      })
    }

    // Generate and send OTP
    const code = await this.otpService.generateOtp(user.id)
    
    if (email) {
      await this.otpService.sendOtpByEmail(email, code, locale)
    } else if (phone) {
      await this.otpService.sendOtpBySms(phone, code, locale)
    }

    return {
      success: true,
      message: email ? 'OTP envoyé par email' : 'OTP envoyé par SMS',
    }
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { email, phone, code } = dto

    // Find user
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          phone ? { phone } : undefined,
        ].filter(Boolean),
      },
    })

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé')
    }

    // Verify OTP
    const isValid = await this.otpService.verifyOtp(user.id, code)
    if (!isValid) {
      throw new UnauthorizedException('Code OTP invalide ou expiré')
    }

    // Update verification status
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: email ? true : user.emailVerified,
        phoneVerified: phone ? true : user.phoneVerified,
      },
    })

    // Generate JWT
    const payload = { sub: user.id, email: user.email, roles: user.roles }
    const accessToken = this.jwtService.sign(payload)

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'auth.login',
        entity: 'User',
        entityId: user.id,
        meta: { method: email ? 'email' : 'phone' },
      },
    })

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        photo: user.photo,
        locale: user.locale,
        roles: user.roles,
      },
    }
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    })
  }

  async logout(userId: string) {
    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: userId,
        action: 'auth.logout',
        entity: 'User',
        entityId: userId,
      },
    })

    return { success: true }
  }
}