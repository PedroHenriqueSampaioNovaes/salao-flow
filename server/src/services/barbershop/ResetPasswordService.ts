import bcrypt from 'bcryptjs';

import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

import { AppError } from '@/src/errors/AppError.js';

interface ResetPasswordRequest {
  token: string;
  password: string;
}

export class ResetPasswordService {
  async execute({ token, password }: ResetPasswordRequest) {
    const barbershopRepository = new BarbershopRepository();

    const barbershop = await barbershopRepository.getByResetToken(token);

    if (!barbershop) {
      throw new AppError('Token de resete de senha inválido ou expirado.', 400);
    }

    if (
      !barbershop.resetPasswordExpires ||
      barbershop.resetPasswordExpires < new Date()
    ) {
      throw new AppError('Token de resete de senha inválido ou expirado.', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await barbershopRepository.updateProfile(barbershop.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }
}
