'use client';

import { useRouter } from 'next/navigation';

import createExpedientAction from '@/app/actions/create-expedient';

import { useExpedientsContext } from '@/src/common/contexts/expedients-context';

import { EmployeeScheduleSchema } from '@sistema-barbearia/validators';

import { ExpedientForm } from '../../_components/ExpedientForm';

export default function NewForm() {
  const router = useRouter();

  const { setExpedients } = useExpedientsContext();

  async function onSubmit(data: EmployeeScheduleSchema) {
    const { data: newExpedient, ok, error } = await createExpedientAction(data);

    if (!ok) return alert(error);

    setExpedients((prev) => [...prev, newExpedient!]);
    router.push('/panel/expedients');
  }

  return <ExpedientForm onSubmit={onSubmit} />;
}
