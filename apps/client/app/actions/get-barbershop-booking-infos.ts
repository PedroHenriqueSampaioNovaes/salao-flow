'use server';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { IBarbershopBookingInfos } from '@/src/common/interfaces/barbershop-booking';

export default async function getBarbershopBookingInfosAction(slug: string) {
  try {
    const data = await FetchApi.get<IBarbershopBookingInfos>(
      `/barbershops/${slug}/booking`,
    );

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
