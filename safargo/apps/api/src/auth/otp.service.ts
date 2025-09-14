import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from 'nestjs-prisma'
import * as crypto from 'crypto'
// import * as nodemailer from 'nodemailer'
// import * as twilio from 'twilio'

@Injectable()
export class OtpService {
  private readonly otpExpiry = 10 * 60 * 1000 // 10 minutes
  private otpStore = new Map<string, { code: string; expires: number }>()

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async generateOtp(userId: string): Promise<string> {
    const code = crypto.randomInt(100000, 999999).toString()
    const expires = Date.now() + this.otpExpiry

    this.otpStore.set(userId, { code, expires })

    return code
  }

  async verifyOtp(userId: string, code: string): Promise<boolean> {
    const stored = this.otpStore.get(userId)
    
    if (!stored) {
      return false
    }

    if (Date.now() > stored.expires) {
      this.otpStore.delete(userId)
      return false
    }

    if (stored.code !== code) {
      return false
    }

    this.otpStore.delete(userId)
    return true
  }

  async sendOtpByEmail(email: string, code: string, locale: string) {
    // TODO: Implement email sending
    console.log(`[DEV] OTP for ${email}: ${code}`)
    
    // In production:
    // const transporter = nodemailer.createTransport({...})
    // await transporter.sendMail({...})

    await this.prisma.notification.create({
      data: {
        userId: 'system',
        channel: 'EMAIL',
        template: 'otp',
        payload: { email, code, locale },
        status: 'SENT',
        sentAt: new Date(),
      },
    })
  }

  async sendOtpBySms(phone: string, code: string, locale: string) {
    // TODO: Implement SMS sending
    console.log(`[DEV] OTP for ${phone}: ${code}`)
    
    // In production:
    // const client = twilio(accountSid, authToken)
    // await client.messages.create({...})

    await this.prisma.notification.create({
      data: {
        userId: 'system',
        channel: 'SMS',
        template: 'otp',
        payload: { phone, code, locale },
        status: 'SENT',
        sentAt: new Date(),
      },
    })
  }
}