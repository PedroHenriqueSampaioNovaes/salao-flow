'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { IAppointment } from '@/src/common/interfaces/appointment';

interface GetAppointmentsActionParams {
  dateString?: string;
}

export default async function getAppointmentsAction({
  dateString,
}: GetAppointmentsActionParams = {}) {
  try {
    const cookieStore = await cookies();

    const data = await FetchApi.get<IAppointment[]>(
      `/appointments?date=${dateString}`,
      {
        token: cookieStore.get('token')?.value,
      },
    );

    return { data: data ?? [], ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
