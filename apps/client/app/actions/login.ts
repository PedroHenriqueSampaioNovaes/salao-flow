'use server';

import { cookies } from 'next/headers';

import { LoginRequest } from '@sistema-barbearia/validators';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

export default async function loginAction(credentials: LoginRequest) {
  try {
    const data = await FetchApi.post<{ token: string }>('/barbershops/login', {
      body: credentials,
    });

    if (data) {
      const cookieStore = await cookies();
      cookieStore.set('token', data.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });
    }

    return { data: null, ok: true, error: null };
  } catch (error) {
    return apiError(error);
  }
}
