'use server';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { IGetAvailableTimeSlotsForBooking } from '@/src/common/interfaces/barbershop-booking';

interface IGetAvailableTimeSlotsForBookingRequest {
  slug: string;
  dateString?: string;
  employeeId?: number;
  lookForNextAvailableTimeSlot?: number;
}

export default async function getAvailableTimeSlotsForBookingAction({
  slug,
  dateString,
  employeeId,
  lookForNextAvailableTimeSlot = 1,
}: IGetAvailableTimeSlotsForBookingRequest) {
  try {
    const params = new URLSearchParams();
    if (dateString) params.append('date', dateString);
    if (employeeId) params.append('employeeId', String(employeeId));
    if (lookForNextAvailableTimeSlot !== undefined) {
      params.append(
        'lookForNextAvailableTimeSlot',
        String(lookForNextAvailableTimeSlot),
      );
    }

    const data = (await FetchApi.get(
      `/barbershops/${slug}/available-slots?${params.toString()}`,
    )) as IGetAvailableTimeSlotsForBooking;

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
