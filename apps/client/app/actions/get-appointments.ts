'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { IAppointment } from '@/src/common/interfaces/appointment';

export default async function getAppointmentsAction() {
  try {
    const cookieStore = await cookies();

    const data = await FetchApi.get<IAppointment[]>(
      `/appointments?date=${new Date().toISOString()}`,
      {
        token: cookieStore.get('token')?.value,
      },
    );

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
