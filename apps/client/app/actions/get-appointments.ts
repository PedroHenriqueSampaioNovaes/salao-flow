'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';
import { Customer } from '@/src/common/interfaces/customer';
import { Employee } from '@/src/common/interfaces/employee';
import { Service } from '@/src/common/interfaces/service';

export interface IAppointment {
  id: string;
  date: string;
  customer: Pick<Customer, 'id' | 'name' | 'phone'>;
  employee: Pick<Employee, 'id' | 'name'>;
  services: Pick<Service, 'name' | 'price'>[];
}

export default async function getAppointmentsAction() {
  try {
    const cookieStore = await cookies();

    const data = await FetchApi.get<IAppointment[]>(
      `/appointments?date=${new Date().toISOString()}`,
      {
        token: cookieStore.get('token')?.value,
      },
    );

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
