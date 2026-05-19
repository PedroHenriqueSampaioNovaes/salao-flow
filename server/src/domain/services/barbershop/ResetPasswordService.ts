import { BarbershopRepository } from '../../repositories/BarbershopRepository.js';
import { HashRepository } from '../../repositories/HashRepository.js';

import { Barbershop } from '../../entities/Barbershop.js';

import { AppError } from '@/src/errors/AppError.js';

interface ResetPasswordRequest {
  token: string;
  password: string;
}

export class ResetPasswordService {
  constructor(
    private barbershopRepository: BarbershopRepository,
    private hashRepository: HashRepository,
  ) {}

  async execute({ token, password }: ResetPasswordRequest) {
    const barbershop = await this.barbershopRepository.findByResetToken(token);

    if (!barbershop) {
      throw new AppError('Token de resete de senha inválido ou expirado.', 400);
    }

    if (
      !barbershop.resetPasswordExpires ||
      barbershop.resetPasswordExpires < new Date()
    ) {
      throw new AppError('Token de resete de senha inválido ou expirado.', 400);
    }

    const hashedPassword = await this.hashRepository.hash(password);

    const updatedBarbershop = new Barbershop({
      id: barbershop.id,
      name: barbershop.name,
      email: barbershop.email,
      address: barbershop.address,
      phone: barbershop.phone,
      image: barbershop.image,
      status: barbershop.status,
      customerId: barbershop.customerId,
      employees: barbershop.employees,
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    await this.barbershopRepository.update(updatedBarbershop);
  }
}
