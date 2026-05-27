import dns from 'node:dns/promises';
import nodemailer from 'nodemailer';

import { AppError } from '../errors/AppError.js';

export async function sendMail(to: string, subject: string, body: string) {
  try {
    const host = process.env.MAIL_HOST as string;
    let resolvedHost = host;

    try {
      const lookupResult = await dns.lookup(host, { family: 4 });
      resolvedHost = lookupResult.address;
    } catch (dnsErr) {
      console.warn('Erro ao resolver DNS:', dnsErr);
    }

    const mailPort = Number(process.env.MAIL_PORT) || 587;

    const transporter = nodemailer.createTransport({
      host: resolvedHost,
      port: mailPort,
      secure: mailPort === 465,
      servername: host,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    } as any);

    await transporter.sendMail({
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
