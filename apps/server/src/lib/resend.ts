import { Resend } from 'resend';

import { AppError } from '../errors/AppError.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail(to: string, subject: string, body: string) {
  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL as string,
      to,
      subject,
      html: body,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(error);
    throw new AppError(
      'Erro ao enviar e-mail. Tente novamente mais tarde ou entre em contato com o suporte.',
      500,
    );
  }
}
