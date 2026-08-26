'use client';

import { useRouter } from 'next/navigation';

import createExpedientAction from '@/app/actions/create-expedient';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { EmployeeScheduleSchema } from '@sistema-barbearia/validators';

import { ExpedientForm } from '../../_components/ExpedientForm';

export default function NewForm() {
  const router = useRouter();

  const { setExpedients } = usePanelContext();

  async function onSubmit(data: EmployeeScheduleSchema) {
    const { data: newExpedient, ok, error } = await createExpedientAction(data);

    if (!ok) return alert(error);

    setExpedients((prev) => [...prev, newExpedient!]);
    router.push('/panel/expedients');
  }

  return <ExpedientForm onSubmit={onSubmit} />;
}
