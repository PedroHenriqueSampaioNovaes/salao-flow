'use server';

import { ForgotPasswordRequest } from '@sistema-barbearia/validators';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

export default async function forgotPasswordAction(
  data: ForgotPasswordRequest,
) {
  try {
    await FetchApi.post<{ message: string }>('/barbershops/forgot-password', {
      body: data,
    });

    return { data: null, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
