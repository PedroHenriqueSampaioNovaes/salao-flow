'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { ICreateAppointment } from '@/src/common/interfaces/appointment';

export default async function createAppointmentAction(
  appointmentData: ICreateAppointment,
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    await FetchApi.post('/appointments', {
      token,
      body: appointmentData,
    });

    return { data: null, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
