'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import {
  ICreateBlockedTime,
  IBlockedTime,
} from '@/src/common/interfaces/employee-schedule';

export default async function createBlockedTimeAction(
  blockedTimeData: ICreateBlockedTime,
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const data = await FetchApi.post<IBlockedTime>('/schedule-blocks', {
      token,
      body: blockedTimeData,
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
