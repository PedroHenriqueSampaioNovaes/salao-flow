'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import {
  IExpedient,
  IWeekdayExpedient,
} from '@/src/common/interfaces/employee';

interface ICreateExpedient {
  name: string;
  weekdays: Omit<IWeekdayExpedient, 'id'>[];
}

export default async function createExpedientAction(
  expedientData: ICreateExpedient,
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const data = await FetchApi.post<IExpedient>('/employee-schedules', {
      token,
      body: expedientData,
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
