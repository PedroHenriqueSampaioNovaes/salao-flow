'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { ICustomer, IUpdateCustomer } from '@/src/common/interfaces/customer';

export default async function updateClientAction(
  id: number,
  clientData: IUpdateCustomer,
) {
  try {
    const cookieStore = await cookies();

    const data = await FetchApi.put<ICustomer>(`/customers/${id}`, {
      token: cookieStore.get('token')?.value,
      body: clientData,
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
