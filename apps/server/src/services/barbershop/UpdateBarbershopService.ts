import bcrypt from 'bcryptjs';

import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

import { UpdateBarbershopSchema } from '@sistema-barbearia/validators';

import { AppError } from '@/src/errors/AppError.js';

export class UpdateBarbershopService {
  async execute(barbershopId: number, data: UpdateBarbershopSchema) {
    const barbershopRepository = new BarbershopRepository();

    const barbershop = await barbershopRepository.getById(barbershopId);

    if (!barbershop) {
      throw new AppError('Barbearia não encontrada.', 404);
    }

    if (data.email && data.email !== barbershop.email) {
      const emailExists = await barbershopRepository.getByEmail(data.email);
      if (emailExists) {
        throw new AppError('Este e-mail já está em uso, escolha outro.', 409);
      }
    }

    const newBarbershopData: UpdateBarbershopSchema = {
      email: data.email,
      name: data.name,
      phone: data.phone,
      address: data.address,
    };

    if (data.slug && data.slug !== barbershop.slug) {
      const slugExists = !!(await barbershopRepository.getBySlug(data.slug));

      if (slugExists) {
        throw new AppError('Slug não permitido, escolha outro.', 409);
      }

      newBarbershopData.slug = data.slug;
    }

    if (data.password) {
      if (!data.currentPassword) {
        throw new AppError(
          'Para alterar a senha, digite também a senha atual.',
          400,
        );
      }

      const currentPasswordIsValid = await bcrypt.compare(
        data.currentPassword,
        barbershop.password,
      );

      if (!currentPasswordIsValid) {
        throw new AppError('Senha atual incorreta.', 401);
      }

      const salt = await bcrypt.genSalt(10);
      newBarbershopData.password = await bcrypt.hash(data.password, salt);
    }

    newBarbershopData.image = `https://ui-avatars.com/api/?name=${data.name}&size=128&rounded=true`;

    const updatedBarbershop = await barbershopRepository.updateProfile(
      barbershopId,
      {
        email: newBarbershopData.email,
        password: newBarbershopData.password,
        name: newBarbershopData.name,
        phone: newBarbershopData.phone,
        address: newBarbershopData.address,
        image: newBarbershopData.image,
        slug: newBarbershopData.slug,
      },
    );

    return updatedBarbershop;
  }
}
