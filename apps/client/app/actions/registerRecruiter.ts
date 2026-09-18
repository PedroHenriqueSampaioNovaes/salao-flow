'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

export default async function registerRecruiterAction() {
  try {
    const data = await FetchApi.post<{ token: string; expiresAt: string }>(
      '/barbershops/recruiter',
    );

    if (data) {
      const cookieStore = await cookies();
      cookieStore.set('token', data.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });
    }

    return { data: null, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
