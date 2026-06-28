'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

export default async function deleteClientAction(clientId: number) {
  try {
    const cookieStore = await cookies();

    await FetchApi.delete(
      `/customers/${clientId}`,
      cookieStore.get('token')?.value,
    );

    return { data: null, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
