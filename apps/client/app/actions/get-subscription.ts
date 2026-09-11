'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { ISubscription } from '@/src/common/interfaces/subscription';

export default async function getSubscriptionAction() {
  try {
    const cookieStore = await cookies();

    const data = await FetchApi.get<ISubscription>('/subscriptions/me', {
      token: cookieStore.get('token')?.value,
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
