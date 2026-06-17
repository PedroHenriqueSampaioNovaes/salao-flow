'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

export default async function deleteEmployeeAction(employeeId: number) {
  try {
    const cookieStore = await cookies();

    await FetchApi.delete(
      `/employees/${employeeId}`,
      cookieStore.get('token')?.value,
    );

    return { data: null, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
