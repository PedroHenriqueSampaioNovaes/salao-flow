'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { ICreateEmployee, IEmployee } from '@/src/common/interfaces/employee';

export default async function createEmployeeAction(
  employeeData: ICreateEmployee,
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const data = await FetchApi.post<IEmployee>('/employees', {
      token,
      body: employeeData,
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
