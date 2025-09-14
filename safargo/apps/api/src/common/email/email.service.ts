import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface EmailOtpData {
  to: string;
  code: string;
  type: string;
  locale: string;
}

interface EmailData {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  locale?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const provider = this.configService.get<string>('EMAIL_PROVIDER', 'smtp');
    
    if (provider === 'sendgrid') {
      this.transporter = nodemailer.createTransporter({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: this.configService.get<string>('EMAIL_API_KEY'),
        },
      });
    } else if (provider === 'mailgun') {
      this.transporter = nodemailer.createTransporter({
        service: 'Mailgun',
        auth: {
          user: this.configService.get<string>('MAILGUN_USERNAME'),
          pass: this.configService.get<string>('EMAIL_API_KEY'),
        },
      });
    } else {
      // SMTP configuration (default for development)
      this.transporter = nodemailer.createTransporter({
        host: this.configService.get<string>('EMAIL_SMTP_HOST', 'localhost'),
        port: this.configService.get<number>('EMAIL_SMTP_PORT', 1025),
        secure: this.configService.get<boolean>('EMAIL_SMTP_SECURE', false),
        auth: this.configService.get<string>('EMAIL_SMTP_USER') ? {
          user: this.configService.get<string>('EMAIL_SMTP_USER'),
          pass: this.configService.get<string>('EMAIL_SMTP_PASS'),
        } : undefined,
      });
    }
  }

  async sendEmail(data: EmailData): Promise<void> {
    try {
      const mailOptions = {
        from: {
          name: this.configService.get<string>('EMAIL_FROM_NAME', 'SafarGo'),
          address: this.configService.get<string>('EMAIL_FROM', 'noreply@safargo.com'),
        },
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${data.to}: ${result.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${data.to}:`, error);
      throw error;
    }
  }

  async sendOtp(data: EmailOtpData): Promise<void> {
    const templates = this.getOtpTemplates(data.locale);
    const template = templates[data.type];

    if (!template) {
      throw new Error(`Unknown OTP type: ${data.type}`);
    }

    const subject = template.subject;
    const html = template.html.replace('{{code}}', data.code);
    const text = template.text.replace('{{code}}', data.code);

    await this.sendEmail({
      to: data.to,
      subject,
      html,
      text,
      locale: data.locale,
    });
  }

  async sendWelcomeEmail(to: string, name: string, locale = 'fr'): Promise<void> {
    const templates = this.getWelcomeTemplates(locale);
    
    const html = templates.html.replace('{{name}}', name);
    const text = templates.text.replace('{{name}}', name);

    await this.sendEmail({
      to,
      subject: templates.subject,
      html,
      text,
      locale,
    });
  }

  async sendTripNotification(to: string, data: any, locale = 'fr'): Promise<void> {
    const templates = this.getTripNotificationTemplates(locale);
    const template = templates[data.type];

    if (!template) {
      throw new Error(`Unknown trip notification type: ${data.type}`);
    }

    let subject = template.subject;
    let html = template.html;
    let text = template.text;

    // Replace placeholders
    Object.keys(data).forEach(key => {
      const value = data[key];
      subject = subject.replace(`{{${key}}}`, value);
      html = html.replace(`{{${key}}}`, value);
      text = text.replace(`{{${key}}}`, value);
    });

    await this.sendEmail({
      to,
      subject,
      html,
      text,
      locale,
    });
  }

  private getOtpTemplates(locale: string) {
    if (locale === 'ar') {
      return {
        email_verification: {
          subject: 'تأكيد البريد الإلكتروني - SafarGo',
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #006233;">مرحباً بك في SafarGo 🇩🇿</h2>
              <p>رمز التحقق الخاص بك هو:</p>
              <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #006233; margin: 20px 0;">
                {{code}}
              </div>
              <p>هذا الرمز صالح لمدة 10 دقائق فقط.</p>
              <p>إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.</p>
              <hr style="margin: 30px 0;">
              <p style="color: #666; font-size: 12px;">SafarGo - منصة المشاركة في السفر</p>
            </div>
          `,
          text: 'رمز التحقق الخاص بك في SafarGo هو: {{code}}. صالح لمدة 10 دقائق.',
        },
        phone_verification: {
          subject: 'تأكيد رقم الهاتف - SafarGo',
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #006233;">تأكيد رقم الهاتف</h2>
              <p>رمز التحقق الخاص بك هو:</p>
              <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #006233; margin: 20px 0;">
                {{code}}
              </div>
              <p>هذا الرمز صالح لمدة 10 دقائق فقط.</p>
            </div>
          `,
          text: 'رمز تأكيد الهاتف في SafarGo: {{code}}',
        },
        password_reset: {
          subject: 'إعادة تعيين كلمة المرور - SafarGo',
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #006233;">إعادة تعيين كلمة المرور</h2>
              <p>رمز إعادة تعيين كلمة المرور الخاص بك هو:</p>
              <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #006233; margin: 20px 0;">
                {{code}}
              </div>
              <p>هذا الرمز صالح لمدة 10 دقائق فقط.</p>
            </div>
          `,
          text: 'رمز إعادة تعيين كلمة المرور في SafarGo: {{code}}',
        },
      };
    }

    // French templates (default)
    return {
      email_verification: {
        subject: 'Vérification email - SafarGo',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #006233;">Bienvenue sur SafarGo 🇩🇿</h2>
            <p>Votre code de vérification est :</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #006233; margin: 20px 0;">
              {{code}}
            </div>
            <p>Ce code est valable pendant 10 minutes seulement.</p>
            <p>Si vous n'avez pas demandé ce code, veuillez ignorer cet email.</p>
            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">SafarGo - Plateforme de covoiturage</p>
          </div>
        `,
        text: 'Votre code de vérification SafarGo est : {{code}}. Valable 10 minutes.',
      },
      phone_verification: {
        subject: 'Vérification téléphone - SafarGo',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #006233;">Vérification de téléphone</h2>
            <p>Votre code de vérification est :</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #006233; margin: 20px 0;">
              {{code}}
            </div>
            <p>Ce code est valable pendant 10 minutes seulement.</p>
          </div>
        `,
        text: 'Code de vérification téléphone SafarGo : {{code}}',
      },
      password_reset: {
        subject: 'Réinitialisation mot de passe - SafarGo',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #006233;">Réinitialisation du mot de passe</h2>
            <p>Votre code de réinitialisation est :</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #006233; margin: 20px 0;">
              {{code}}
            </div>
            <p>Ce code est valable pendant 10 minutes seulement.</p>
          </div>
        `,
        text: 'Code de réinitialisation mot de passe SafarGo : {{code}}',
      },
    };
  }

  private getWelcomeTemplates(locale: string) {
    if (locale === 'ar') {
      return {
        subject: 'مرحباً بك في SafarGo 🇩🇿',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #006233;">أهلاً وسهلاً {{name}}! 🇩🇿</h2>
            <p>مرحباً بك في SafarGo، منصة المشاركة في السفر الرائدة في الجزائر.</p>
            <p>يمكنك الآن:</p>
            <ul>
              <li>البحث عن رحلات مشتركة</li>
              <li>نشر رحلاتك الخاصة</li>
              <li>اكتشاف الأماكن السياحية الجميلة في الجزائر</li>
            </ul>
            <p>شكراً لانضمامك إلينا!</p>
            <p>فريق SafarGo</p>
          </div>
        `,
        text: 'مرحباً {{name}}! أهلاً بك في SafarGo، منصة المشاركة في السفر في الجزائر.',
      };
    }

    return {
      subject: 'Bienvenue sur SafarGo 🇩🇿',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #006233;">Bienvenue {{name}} ! 🇩🇿</h2>
          <p>Merci de rejoindre SafarGo, la plateforme de covoiturage de référence en Algérie.</p>
          <p>Vous pouvez maintenant :</p>
          <ul>
            <li>Rechercher des trajets partagés</li>
            <li>Publier vos propres trajets</li>
            <li>Découvrir les merveilles touristiques de l'Algérie</li>
          </ul>
          <p>Bon voyage avec SafarGo !</p>
          <p>L'équipe SafarGo</p>
        </div>
      `,
      text: 'Bienvenue {{name}} ! Merci de rejoindre SafarGo, la plateforme de covoiturage en Algérie.',
    };
  }

  private getTripNotificationTemplates(locale: string) {
    // Trip notification templates would be implemented here
    // For now, returning basic structure
    return {
      booking_confirmed: {
        subject: 'Réservation confirmée',
        html: '<p>Votre réservation a été confirmée.</p>',
        text: 'Votre réservation a été confirmée.',
      },
    };
  }
}