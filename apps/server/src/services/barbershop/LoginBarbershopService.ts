import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { AppError } from '@/src/errors/AppError.js';

import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

interface LoginRequest {
  email: string;
  password: string;
}

export class LoginBarbershopService {
  async execute(loginData: LoginRequest) {
    const barbershopRepository = new BarbershopRepository();

    const barbershop = await barbershopRepository.getByEmail(loginData.email);

    if (!barbershop) {
      throw new AppError('E-mail ou senha incorretos.', 401);
    }

    const passwordMatch = bcrypt.compareSync(
      loginData.password,
      barbershop.password,
    );

    if (!passwordMatch) {
      throw new AppError('E-mail ou senha incorretos.', 401);
    }

    if (
      barbershop.status === true &&
      barbershop.subscription?.plan === 'FREE'
    ) {
      const dateWithinNext30Days = new Date();
      dateWithinNext30Days.setDate(barbershop.createdAt.getDate() + 30);

      if (barbershop.createdAt.getTime() >= dateWithinNext30Days.getTime()) {
        await barbershopRepository.updateProfile(barbershop.id, {
          status: false,
          subscription: {
            status: 'INACTIVE',
          },
        });
      }
    }

    const token = jwt.sign(
      { id: barbershop.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' },
    );

    return { token };
  }
}
