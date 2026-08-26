'use client';

import { useRouter } from 'next/navigation';

import createBlockedTimeAction from '@/app/actions/create-blocked-time';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { BlockedTimesForm } from '../../_components/BlockedTimesForm';

import { CreateScheduleBlockFormData } from '../../_hooks/useBlockedTimesForm';

export default function NewForm() {
  const router = useRouter();

  const { setBlockedTimes } = usePanelContext();

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
