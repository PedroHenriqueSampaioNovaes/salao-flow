'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { IDashboardMetrics } from '@/src/common/interfaces/barbershop';

export default async function getDashboardMetricsAction() {
  try {
    const cookieStore = await cookies();

    const data = await FetchApi.get<IDashboardMetrics>('/barbershops/me/dashboard-metrics', {
      token: cookieStore.get('token')?.value,
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
