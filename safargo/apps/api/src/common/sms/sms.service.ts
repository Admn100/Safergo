import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface SmsOtpData {
  to: string;
  code: string;
  type: string;
  locale: string;
}

interface SmsData {
  to: string | string[];
  message: string;
  locale?: string;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private twilioClient: any;

  constructor(private configService: ConfigService) {
    this.initializeSmsProvider();
  }

  private initializeSmsProvider() {
    const provider = this.configService.get<string>('SMS_PROVIDER', 'twilio');
    
    if (provider === 'twilio') {
      try {
        const twilio = require('twilio');
        const accountSid = this.configService.get<string>('SMS_ACCOUNT_SID');
        const authToken = this.configService.get<string>('SMS_AUTH_TOKEN');
        
        if (accountSid && authToken) {
          this.twilioClient = twilio(accountSid, authToken);
        } else {
          this.logger.warn('Twilio credentials not configured, SMS will be mocked');
        }
      } catch (error) {
        this.logger.warn('Twilio package not installed, SMS will be mocked');
      }
    }
  }

  async sendSms(data: SmsData): Promise<void> {
    try {
      const provider = this.configService.get<string>('SMS_PROVIDER', 'twilio');
      const recipients = Array.isArray(data.to) ? data.to : [data.to];

      for (const recipient of recipients) {
        if (provider === 'twilio' && this.twilioClient) {
          await this.sendTwilioSms(recipient, data.message);
        } else {
          // Mock SMS for development
          this.mockSms(recipient, data.message);
        }
      }

      this.logger.log(`SMS sent successfully to ${data.to}`);
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${data.to}:`, error);
      throw error;
    }
  }

  async sendOtp(data: SmsOtpData): Promise<void> {
    const message = this.getOtpMessage(data.code, data.type, data.locale);
    
    await this.sendSms({
      to: data.to,
      message,
      locale: data.locale,
    });
  }

  async sendTripNotification(to: string, data: any, locale = 'fr'): Promise<void> {
    const message = this.getTripNotificationMessage(data, locale);
    
    await this.sendSms({
      to,
      message,
      locale,
    });
  }

  private async sendTwilioSms(to: string, message: string): Promise<void> {
    const fromNumber = this.configService.get<string>('SMS_FROM');
    
    await this.twilioClient.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    });
  }

  private mockSms(to: string, message: string): void {
    this.logger.log(`📱 MOCK SMS to ${to}: ${message}`);
    
    // In development, we could save to database or file for testing
    if (this.configService.get('NODE_ENV') === 'development') {
      console.log(`\n=== SMS MOCK ===`);
      console.log(`To: ${to}`);
      console.log(`Message: ${message}`);
      console.log(`================\n`);
    }
  }

  private getOtpMessage(code: string, type: string, locale: string): string {
    if (locale === 'ar') {
      switch (type) {
        case 'phone_verification':
          return `رمز التحقق في SafarGo: ${code}. صالح لمدة 10 دقائق.`;
        case 'password_reset':
          return `رمز إعادة تعيين كلمة المرور في SafarGo: ${code}. صالح لمدة 10 دقائق.`;
        default:
          return `رمز SafarGo: ${code}`;
      }
    }

    // French (default)
    switch (type) {
      case 'phone_verification':
        return `Code de vérification SafarGo : ${code}. Valable 10 minutes.`;
      case 'password_reset':
        return `Code de réinitialisation SafarGo : ${code}. Valable 10 minutes.`;
      default:
        return `Code SafarGo : ${code}`;
    }
  }

  private getTripNotificationMessage(data: any, locale: string): string {
    if (locale === 'ar') {
      switch (data.type) {
        case 'booking_confirmed':
          return `تم تأكيد حجزك للرحلة ${data.tripId}. تفاصيل أكثر في التطبيق.`;
        case 'trip_reminder':
          return `تذكير: رحلتك من ${data.origin} إلى ${data.destination} غداً في ${data.time}.`;
        default:
          return `إشعار من SafarGo بخصوص رحلتك.`;
      }
    }

    // French (default)
    switch (data.type) {
      case 'booking_confirmed':
        return `Votre réservation pour le trajet ${data.tripId} est confirmée. Plus de détails dans l'app.`;
      case 'trip_reminder':
        return `Rappel : votre trajet ${data.origin} → ${data.destination} demain à ${data.time}.`;
      default:
        return `Notification SafarGo concernant votre trajet.`;
    }
  }
}