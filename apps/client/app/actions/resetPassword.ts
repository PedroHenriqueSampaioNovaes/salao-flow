'use server';

import { ResetPasswordInput } from '@sistema-barbearia/validators';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

export default async function resetPasswordAction(data: ResetPasswordInput) {
  try {
    await FetchApi.post<{ message: string }>('/barbershops/reset-password', {
      body: data,
    });

    return { data: null, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
