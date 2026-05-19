import nodemailer from 'nodemailer';

import { MailProvider } from '@/src/domain/providers/MailProvider.js';
import { AppError } from '@/src/errors/AppError.js';

export class NodemailerMailAdapter implements MailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, body: string) {
    try {
      await this.transporter.sendMail({
        from: 'onboarding@resend.dev',
        to,
        subject,
        html: body,
      });
    } catch (error) {
      console.error(error);
      throw new AppError(
        'Erro ao enviar e-mail. Tente novamente mais tarde ou entre em contato com o suporte.',
        500,
      );
    }
  }
}
