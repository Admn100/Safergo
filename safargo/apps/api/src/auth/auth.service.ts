import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../database/prisma.service';
import { EmailService } from '../common/email/email.service';
import { SmsService } from '../common/sms/sms.service';
import { generateOTP } from '@safargo/shared';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
    private smsService: SmsService,
  ) {}

  /**
   * Validate user credentials for local strategy
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        userPreferences: true,
        driver: true,
      },
    });

    if (!user || !user.passwordHash) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  /**
   * Generate JWT tokens
   */
  async generateTokens(userId: string) {
    const payload = { sub: userId };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '1h'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    // Store refresh token in database
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login with email/password
   */
  async login(user: any) {
    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        photo: user.photo,
        roles: user.roles,
        locale: user.locale,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
      },
      ...tokens,
    };
  }

  /**
   * Register new user
   */
  async register(data: {
    email: string;
    name: string;
    phone?: string;
    password: string;
    locale?: string;
  }) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          ...(data.phone ? [{ phone: data.phone }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists with this email or phone');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        passwordHash,
        locale: data.locale || 'fr',
        userPreferences: {
          create: {
            language: data.locale || 'fr',
          },
        },
      },
      include: {
        userPreferences: true,
      },
    });

    // Send email verification
    await this.sendEmailVerification(user.id);

    const tokens = await this.generateTokens(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        photo: user.photo,
        roles: user.roles,
        locale: user.locale,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
      },
      ...tokens,
    };
  }

  /**
   * Request OTP for email or phone
   */
  async requestOtp(data: { email?: string; phone?: string; type: string }) {
    if (!data.email && !data.phone) {
      throw new BadRequestException('Email or phone is required');
    }

    let user;
    if (data.email) {
      user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
    } else if (data.phone) {
      user = await this.prisma.user.findUnique({
        where: { phone: data.phone },
      });
    }

    if (!user && data.type !== 'registration') {
      throw new BadRequestException('User not found');
    }

    // Generate OTP
    const code = generateOTP(6);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (user) {
      // Clean up old OTPs
      await this.prisma.otpCode.deleteMany({
        where: {
          userId: user.id,
          type: data.type,
        },
      });

      // Create new OTP
      await this.prisma.otpCode.create({
        data: {
          userId: user.id,
          code,
          type: data.type,
          expiresAt,
        },
      });
    }

    // Send OTP
    if (data.email) {
      await this.emailService.sendOtp({
        to: data.email,
        code,
        type: data.type,
        locale: user?.locale || 'fr',
      });
    } else if (data.phone) {
      await this.smsService.sendOtp({
        to: data.phone,
        code,
        type: data.type,
        locale: user?.locale || 'fr',
      });
    }

    this.logger.log(`OTP sent for ${data.type} to ${data.email || data.phone}`);

    return {
      message: 'OTP sent successfully',
      expiresAt,
    };
  }

  /**
   * Verify OTP
   */
  async verifyOtp(data: {
    email?: string;
    phone?: string;
    code: string;
    type: string;
  }) {
    if (!data.email && !data.phone) {
      throw new BadRequestException('Email or phone is required');
    }

    let user;
    if (data.email) {
      user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
    } else if (data.phone) {
      user = await this.prisma.user.findUnique({
        where: { phone: data.phone },
      });
    }

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Find valid OTP
    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        code: data.code,
        type: data.type,
        used: false,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Mark OTP as used
    await this.prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    // Update user verification status
    const updateData: any = {};
    if (data.type === 'email_verification') {
      updateData.emailVerified = true;
    } else if (data.type === 'phone_verification') {
      updateData.phoneVerified = true;
    }

    if (Object.keys(updateData).length > 0) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
    }

    this.logger.log(`OTP verified for ${data.type} - User: ${user.id}`);

    return {
      message: 'OTP verified successfully',
      verified: true,
    };
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    return this.requestOtp({
      email: user.email,
      type: 'email_verification',
    });
  }

  /**
   * Send phone verification
   */
  async sendPhoneVerification(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.phone) {
      throw new BadRequestException('User or phone not found');
    }

    if (user.phoneVerified) {
      throw new BadRequestException('Phone already verified');
    }

    return this.requestOtp({
      phone: user.phone,
      type: 'phone_verification',
    });
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Check if refresh token exists in database
      const tokenRecord = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(payload.sub);

      // Remove old refresh token
      await this.prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout user
   */
  async logout(refreshToken: string) {
    try {
      await this.prisma.refreshToken.delete({
        where: { token: refreshToken },
      });
    } catch (error) {
      // Token might not exist, which is fine
      this.logger.warn('Refresh token not found during logout');
    }

    return { message: 'Logged out successfully' };
  }

  /**
   * Reset password
   */
  async resetPassword(data: {
    email: string;
    code: string;
    newPassword: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Verify OTP
    await this.verifyOtp({
      email: data.email,
      code: data.code,
      type: 'password_reset',
    });

    // Hash new password
    const passwordHash = await bcrypt.hash(data.newPassword, 12);

    // Update password
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Invalidate all refresh tokens
    await this.prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    this.logger.log(`Password reset for user: ${user.id}`);

    return { message: 'Password reset successfully' };
  }

  /**
   * Get user by ID for JWT strategy
   */
  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userPreferences: true,
        driver: {
          include: {
            vehicles: true,
          },
        },
      },
    });

    if (!user || user.status !== 'active') {
      return null;
    }

    return user;
  }
}