import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RequestOtpDto, VerifyOtpDto } from '@safargo/shared'
import { ZodValidationPipe } from 'nestjs-zod'
import { requestOtpSchema, verifyOtpSchema } from '@safargo/shared'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('otp/request')
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 requests per 5 minutes
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Demander un code OTP' })
  @ApiResponse({ status: 200, description: 'OTP envoyé avec succès' })
  @ApiResponse({ status: 429, description: 'Trop de tentatives' })
  async requestOtp(
    @Body(new ZodValidationPipe(requestOtpSchema)) dto: RequestOtpDto,
  ) {
    return this.authService.requestOtp(dto)
  }

  @Post('otp/verify')
  @Throttle({ default: { limit: 5, ttl: 300000 } }) // 5 attempts per 5 minutes
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vérifier le code OTP' })
  @ApiResponse({ status: 200, description: 'Authentification réussie' })
  @ApiResponse({ status: 401, description: 'Code invalide ou expiré' })
  async verifyOtp(
    @Body(new ZodValidationPipe(verifyOtpSchema)) dto: VerifyOtpDto,
  ) {
    return this.authService.verifyOtp(dto)
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Se déconnecter' })
  @ApiResponse({ status: 200, description: 'Déconnexion réussie' })
  async logout(@Request() req) {
    return this.authService.logout(req.user.id)
  }
}