'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { ICustomer } from '@/src/common/interfaces/customer';

export default async function getClientsAction() {
  try {
    const cookieStore = await cookies();

    const data = await FetchApi.get<ICustomer[]>(`/customers`, {
      token: cookieStore.get('token')?.value,
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
