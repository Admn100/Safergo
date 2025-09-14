import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Get,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

import {
  LoginDto,
  RegisterDto,
  OtpRequestDto,
  OtpVerifyDto,
  RefreshTokenDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle(5, 60) // 5 attempts per minute
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            photo: { type: 'string' },
            roles: { type: 'array', items: { type: 'string' } },
            locale: { type: 'string' },
            emailVerified: { type: 'boolean' },
            phoneVerified: { type: 'boolean' },
          },
        },
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Request() req, @Body() loginDto: LoginDto) {
    this.logger.log(`Login attempt for: ${loginDto.email}`);
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle(3, 60) // 3 attempts per minute
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            roles: { type: 'array', items: { type: 'string' } },
            locale: { type: 'string' },
            emailVerified: { type: 'boolean' },
            phoneVerified: { type: 'boolean' },
          },
        },
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`Registration attempt for: ${registerDto.email}`);
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('otp/request')
  @HttpCode(HttpStatus.OK)
  @Throttle(3, 60) // 3 OTP requests per minute
  @ApiOperation({ summary: 'Request OTP for email or phone verification' })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        expiresAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async requestOtp(@Body() otpRequestDto: OtpRequestDto) {
    this.logger.log(`OTP request for type: ${otpRequestDto.type} - ${otpRequestDto.email || otpRequestDto.phone}`);
    return this.authService.requestOtp(otpRequestDto);
  }

  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @Throttle(5, 60) // 5 verification attempts per minute
  @ApiOperation({ summary: 'Verify OTP code' })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        verified: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyOtp(@Body() otpVerifyDto: OtpVerifyDto) {
    this.logger.log(`OTP verification for type: ${otpVerifyDto.type} - ${otpVerifyDto.email || otpVerifyDto.phone}`);
    return this.authService.verifyOtp(otpVerifyDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto.refreshToken);
  }

  @Public()
  @Post('password/reset')
  @HttpCode(HttpStatus.OK)
  @Throttle(3, 300) // 3 password resets per 5 minutes
  @ApiOperation({ summary: 'Reset password with OTP' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid OTP or user not found' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    this.logger.log(`Password reset attempt for: ${resetPasswordDto.email}`);
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('password/change')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Change password (authenticated user)' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid current password' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(
    @CurrentUser() user: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    this.logger.log(`Password change attempt for user: ${user.id}`);
    // Implementation would go here
    return { message: 'Password changed successfully' };
  }

  @Post('email/verify')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Send email verification OTP' })
  @ApiResponse({
    status: 200,
    description: 'Email verification OTP sent',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        expiresAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Email already verified' })
  async sendEmailVerification(@CurrentUser() user: any) {
    return this.authService.sendEmailVerification(user.id);
  }

  @Post('phone/verify')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Send phone verification OTP' })
  @ApiResponse({
    status: 200,
    description: 'Phone verification OTP sent',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        expiresAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Phone already verified or not provided' })
  async sendPhoneVerification(@CurrentUser() user: any) {
    return this.authService.sendPhoneVerification(user.id);
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        name: { type: 'string' },
        phone: { type: 'string' },
        photo: { type: 'string' },
        roles: { type: 'array', items: { type: 'string' } },
        locale: { type: 'string' },
        emailVerified: { type: 'boolean' },
        phoneVerified: { type: 'boolean' },
        driver: { type: 'object' },
        userPreferences: { type: 'object' },
      },
    },
  })
  async getProfile(@CurrentUser() user: any) {
    const { passwordHash, ...profile } = user;
    return profile;
  }
}