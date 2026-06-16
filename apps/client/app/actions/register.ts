'use server';

import { CreateBarbershopSchema } from '@sistema-barbearia/validators';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

export default async function registerAction(
  accountData: CreateBarbershopSchema,
) {
  try {
    await FetchApi.post('/barbershops', {
      body: accountData,
    });

    return { data: null, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
