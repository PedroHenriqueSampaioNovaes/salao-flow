import { randomBytes } from 'node:crypto';

import { AppError } from '@/src/errors/AppError.js';

import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

import { sendMail } from '@/src/lib/resend.js';

interface ForgotPasswordRequest {
  email: string;
}

export class ForgotPasswordService {
  async execute(forgotPasswordData: ForgotPasswordRequest) {
    const barbershopRepository = new BarbershopRepository();

    const barbershop = await barbershopRepository.getByEmail(
      forgotPasswordData.email,
    );

    if (!barbershop) {
      throw new AppError('E-mail não encontrado.', 404);
    }

    const resetToken = randomBytes(20).toString('hex');
    const resetExpires = new Date();
    resetExpires.setMinutes(resetExpires.getMinutes() + 15);

    await barbershopRepository.updateProfile(barbershop.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    });

    const resetLink = `${process.env.FRONTEND_RESET_PASSWORD_URL}?token=${resetToken}`;

    await sendMail(
      barbershop.email,
      'Recuperação de Senha',
      `<h1>Recuperação de Senha</h1><p>Você solicitou a recuperação de senha.</p><p>Clique no link abaixo para redefinir sua senha:</p><p><a href="${resetLink}">Redefinir Senha</a></p><p>Este link expira em 15 minutos.</p>`,
    );

    return {
      message:
        'Token de redefinição de senha enviado com sucesso para o e-mail. Se não encontrar na caixa de entrada, verifique a caixa de spam.',
      resetToken,
    };
  }
}
