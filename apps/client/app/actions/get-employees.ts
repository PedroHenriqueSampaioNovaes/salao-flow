'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { IEmployee } from '@/src/common/interfaces/employee';

export default async function getEmployeesAction() {
  try {
    const cookieStore = await cookies();

    const data = await FetchApi.get<Pick<IEmployee, 'id' | 'name' | 'image'>[]>(
      '/employees',
      {
        token: cookieStore.get('token')?.value,
      },
    );

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
