'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { IBlockedTime } from '@/src/common/interfaces/employee-schedule';

export default async function getBlockedTimesAction() {
  try {
    const cookieStore = await cookies();

    const data = await FetchApi.get<IBlockedTime[]>('/schedule-blocks', {
      token: cookieStore.get('token')?.value,
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
