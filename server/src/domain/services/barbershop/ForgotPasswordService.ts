import { randomBytes } from 'crypto';

import { AppError } from '@/src/errors/AppError.js';

import { BarbershopRepository } from '../../repositories/BarbershopRepository.js';
import { MailProvider } from '../../providers/MailProvider.js';
import { Barbershop } from '../../entities/Barbershop.js';

interface ForgotPasswordRequest {
  email: string;
}

export class ForgotPasswordService {
  constructor(
    private barbershopRepository: BarbershopRepository,
    private mailProvider: MailProvider,
  ) {}

  async execute({ email }: ForgotPasswordRequest) {
    const barbershop = await this.barbershopRepository.findByEmail(email);

    if (!barbershop) {
      throw new AppError('Barbearia não encontrada.', 404);
    }

    const resetToken = randomBytes(20).toString('hex');
    const resetExpires = new Date();
    resetExpires.setMinutes(resetExpires.getMinutes() + 15);

    const updatedBarbershop = new Barbershop({
      id: barbershop.id,
      name: barbershop.name,
      email: barbershop.email,
      password: barbershop.password,
      address: barbershop.address,
      phone: barbershop.phone,
      image: barbershop.image,
      status: barbershop.status,
      customerId: barbershop.customerId,
      employees: barbershop.employees,
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    });

    await this.barbershopRepository.update(updatedBarbershop);

    const resetLink = `${process.env.FRONTEND_RESET_PASSWORD_URL}?token=${resetToken}`;

    await this.mailProvider.sendMail(
      barbershop.email,
      'Recuperação de Senha',
      `<p>Você solicitou a recuperação de senha.</p><p>Clique no link abaixo para redefinir sua senha:</p><p><a href="${resetLink}">Redefinir Senha</a></p><p>Este link expira em 15 minutos.</p>`,
    );

    return {
      message:
        'Token de redefinição de senha enviado com sucesso para o e-mail. Se não encontrar na caixa de entrada, verifique a caixa de spam.',
      resetToken,
    };
  }
}
