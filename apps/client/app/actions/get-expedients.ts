'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { IExpedient } from '@/src/common/interfaces/employee';

export default async function getExpedientsAction() {
  try {
    const cookieStore = await cookies();

    const data = await FetchApi.get<IExpedient[]>('/employee-schedules', {
      token: cookieStore.get('token')?.value,
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
