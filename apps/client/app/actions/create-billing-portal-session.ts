'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

export default async function createBillingPortalSessionAction() {
  try {
    const cookieStore = await cookies();

    const data = await FetchApi.post<{ url: string }>(
      '/subscriptions/billing-portal',
      { token: cookieStore.get('token')?.value },
    );

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
