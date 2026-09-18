import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

import { AppError } from '@/src/errors/AppError.js';

import { slugify } from '@/src/utils/slugify.js';
import { generateRandomChars } from '@/src/utils/generateRandomChars.js';
import { generateFakeBarbershopData } from '@/src/utils/generateFakeBarbershopData.js';

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export class CreateRecruiterAccountService {
  async execute() {
    const barbershopRepository = new BarbershopRepository();

    const fakeData = generateFakeBarbershopData();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(fakeData.password, salt);

    const baseSlug = slugify(fakeData.businessName);

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

    const expiresAt = new Date(Date.now() + ONE_DAY_IN_MS);

    const barbershop = await barbershopRepository.createRecruiterAccount({
      ...fakeData,
      password: hashedPassword,
      slug,
      image: `https://ui-avatars.com/api/?name=${fakeData.businessName}&size=96`,
      expiresAt,
    });

    const token = jwt.sign(
      { id: barbershop.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' },
    );

    return { token, expiresAt };
  }
}
