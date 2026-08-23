'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import {
  IAppointment,
  ICreateAppointment,
} from '@/src/common/interfaces/appointment';

export default async function createAppointmentAction(
  appointmentData: ICreateAppointment,
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const data = await FetchApi.post<IAppointment>('/appointments', {
      token,
      body: appointmentData,
    });

    if (data === null) throw new Error('Não foi possível criar o agendamento.');

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
