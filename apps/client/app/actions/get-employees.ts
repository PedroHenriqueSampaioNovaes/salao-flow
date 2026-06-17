'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

export interface IEmployee {
  id: number;
  name: string;
  image: string;
}

export default async function getEmployeesAction() {
  try {
    const cookieStore = await cookies();

    const data = await FetchApi.get<IEmployee[]>('/employees', {
      token: cookieStore.get('token')?.value,
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
