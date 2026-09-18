import { fakerPT_BR as faker } from '@faker-js/faker';

import { generateRandomChars } from '@/src/utils/generateRandomChars.js';

export function generateFakeBarbershopData() {
  const uniqueSuffix = generateRandomChars(6);

  const name = faker.person.fullName();
  const businessName = `Barbearia ${faker.person.lastName()}`;
  const phone = `(${faker.string.numeric(2)}) 9${faker.string.numeric(4)}-${faker.string.numeric(4)}`;

  return {
    name,
    businessName,
    email: `recrutador-${uniqueSuffix}@teste.com`,
    password: generateRandomChars(12),
    address: faker.location.streetAddress({ useFullAddress: true }),
    phone,
    timezone: 'America/Sao_Paulo',
  };
}
