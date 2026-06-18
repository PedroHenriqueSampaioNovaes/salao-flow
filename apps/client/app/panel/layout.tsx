import { Metadata } from 'next';

import getAppointmentsAction from '../actions/get-appointments';
import getEmployeesAction from '../actions/get-employees';
import getBarbershopAction from '../actions/get-barbershop';

import { PanelProvider } from '@/src/common/contexts/panel-context';

export const metadata: Metadata = {
  title: 'SalãoFlow',
  description:
    'Gerencie agendamentos, clientes e serviços de forma simples e eficiente.',
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: barbershop } = await getBarbershopAction();
  const { data: appointments } = await getAppointmentsAction();
  const { data: employees } = await getEmployeesAction();

  return (
    <PanelProvider
      barbershopData={barbershop ?? null}
      appointmentsData={appointments ?? []}
      employeesData={employees ?? []}
    >
      {children}
    </PanelProvider>
  );
}
