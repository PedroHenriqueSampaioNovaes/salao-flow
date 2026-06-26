'use client';

import { useRouter } from 'next/navigation';

import createBlockedTimeAction from '@/app/actions/create-blocked-time';

import { useBlockedTimesContext } from '@/src/common/contexts/blocked-times-context';

import { BlockedTimesForm } from '../../_components/BlockedTimesForm';

import { CreateScheduleBlockFormData } from '../../_hooks/useBlockedTimesForm';

export default function NewForm() {
  const router = useRouter();

  const { setBlockedTimes } = useBlockedTimesContext();

  async function onSubmit(data: CreateScheduleBlockFormData) {
    const {
      data: serviceResponse,
      ok,
      error,
    } = await createBlockedTimeAction({
      ...data,
      employeeIds: data.employeeIds.map(Number),
    });

    if (!ok) return alert(error);

    setBlockedTimes((prev) => [...prev, serviceResponse!]);
    router.push('/panel/blocked-times');
  }

  return <BlockedTimesForm onSubmit={onSubmit} />;
}
