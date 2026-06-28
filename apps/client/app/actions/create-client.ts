'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { ICreateCustomer, ICustomer } from '@/src/common/interfaces/customer';

type ICreateClientResponse = Omit<ICustomer, 'isBlocked'>;

export default async function createClientAction(clientData: ICreateCustomer) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const data = await FetchApi.post<ICreateClientResponse>('/customers', {
      token,
      body: clientData,
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
