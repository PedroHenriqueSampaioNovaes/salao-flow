'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { IEmployee } from '@/src/common/interfaces/employee';

interface IUpdateEmployeeAction {
  id: number;
  employeeData: Partial<IEmployee>;
}

export default async function updateEmployeeAction({
  id,
  employeeData,
}: IUpdateEmployeeAction) {
  try {
    const cookieStore = await cookies();

    const data = await FetchApi.put<IEmployee>(`/employees/${id}`, {
      token: cookieStore.get('token')?.value,
      body: employeeData,
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
