import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

import bcrypt from 'bcryptjs';

import { CreateBarbershop } from '@/src/interfaces/Barbershop.js';

import { AppError } from '@/src/errors/AppError.js';

export class CreateBarbershopService {
  async execute(data: CreateBarbershop) {
    const barbershopRepository = new BarbershopRepository();

    const barbershopAlreadyExists = await barbershopRepository.getByEmail(
      data.email,
    );

    if (barbershopAlreadyExists) {
      throw new AppError('Este e-mail já está em uso, escolha outro.', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const barbershopData = {
      ...data,
      password: hashedPassword,
      image: `https://ui-avatars.com/api/?name=${data.name}&size=128&rounded=true`,
    };

    await barbershopRepository.create(barbershopData);

    return { message: 'Conta criada com sucesso!' };
  }
}
