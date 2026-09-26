import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

import bcrypt from 'bcryptjs';

import { CreateBarbershop } from '@/src/interfaces/Barbershop.js';

import { AppError } from '@/src/errors/AppError.js';

import { slugify } from '@/src/utils/slugify.js';
import { generateRandomChars } from '@/src/utils/generateRandomChars.js';
import { isValidTimeZone } from '@/src/utils/isValidTimeZone.js';

import { CreateStripeSubscriptionService } from '@/src/services/subscription/CreateStripeSubscriptionService.js';

export class CreateBarbershopService {
  async execute(data: CreateBarbershop) {
    const barbershopRepository = new BarbershopRepository();

    const barbershopAlreadyExists = await barbershopRepository.getByEmail(
      data.email,
    );

    if (barbershopAlreadyExists) {
      throw new AppError('Este e-mail já está em uso, escolha outro.', 409);
    }

    const barbershopWithSamePhoneAlreadyExists =
      await barbershopRepository.getByPhone(data.phone);

    if (barbershopWithSamePhoneAlreadyExists) {
      throw new AppError('Este número de telefone já está em uso.', 409);
    }

    if (!isValidTimeZone(data.timezone)) {
      throw new AppError('Fuso horário inválido.', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const baseSlug = slugify(data.name);

    let slug: string;
    let slugExists: boolean;

    const maxRetries = 3;
    let retries = 0;

    do {
      slug = `${baseSlug}-${generateRandomChars(5)}`;
      const existing = await barbershopRepository.getBySlug(slug);
      slugExists = !!existing;

      if (slugExists && retries < maxRetries) {
        retries++;
      } else if (slugExists && retries >= maxRetries) {
        throw new AppError(
          'Ops! Ocorreu um erro ao gerar URL única, tente novamente.',
          500,
        );
      }
    } while (slugExists);

    const stripeSubscription =
      await new CreateStripeSubscriptionService().execute({
        email: data.email,
        name: data.businessName,
      });

    const barbershopData = {
      ...data,
      password: hashedPassword,
      slug,
      image: `https://ui-avatars.com/api/?name=${data.businessName}&size=96`,
    };

    await barbershopRepository.create(barbershopData, stripeSubscription);

    return { message: 'Conta criada com sucesso!' };
  }
}
