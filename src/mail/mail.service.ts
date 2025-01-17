import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendPasswordReset(email: string, resetLink: string) {
    console.log('Sending password reset email to', email);
    console.log('smtp', this.configService.get('MAIL_HOST'));
    await this.mailerService.sendMail({
      to: email,
      from: this.configService.get('mail.from'), 
      subject: 'Password Reset Request',
      template: 'password-reset',
      context: {
        resetLink,
        appName: this.configService.get('APP_NAME', 'Sweet Home Services'),
        supportEmail: this.configService.get('SUPPORT_EMAIL', 'support@example.com'),
      },
    });
  }
}