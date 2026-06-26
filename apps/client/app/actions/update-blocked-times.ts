'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import {
  ICreateBlockedTime,
  IBlockedTime,
} from '@/src/common/interfaces/employee-schedule';

export default async function updateBlockedTimesAction(
  id: string,
  blockedTimeData: ICreateBlockedTime,
) {
  try {
    const cookieStore = await cookies();

    const initialDate = new Date(
      `${blockedTimeData.initialDate}T${blockedTimeData.initialTime}`,
    ).toISOString();
    const finalDate = new Date(
      `${blockedTimeData.finalDate}T${blockedTimeData.finalTime}`,
    ).toISOString();

    const data = await FetchApi.put<IBlockedTime>(`/schedule-blocks/${id}`, {
      token: cookieStore.get('token')?.value,
      body: {
        ...blockedTimeData,
        initialDate,
        finalDate,
      },
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
