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

    const { confirmPassword, ...updateData } = data;

    if (updateData.slug && updateData.slug !== barbershop.slug) {
      const slugExists = !!(await barbershopRepository.getBySlug(
        updateData.slug,
      ));

      if (slugExists) {
        throw new AppError('Slug não permitido, escolha outro.', 409);
      }
    }

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    updateData.image = `https://ui-avatars.com/api/?name=${data.name}&size=128&rounded=true`;

    const updatedBarbershop = await barbershopRepository.updateProfile(
      barbershopId,
      updateData,
    );

    return updatedBarbershop;
  }
}
