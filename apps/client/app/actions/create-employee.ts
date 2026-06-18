'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { ICreateEmployee } from '@/src/common/interfaces/employee';

interface IResponseCreateEmployee {
  name: string;
  image: string;
}

export default async function createEmployeeAction(
  employeeData: ICreateEmployee,
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    await FetchApi.post<IResponseCreateEmployee>('/employees', {
      token,
      body: employeeData,
    });

    return { data: null, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
