import { Metadata } from 'next';
import { Suspense } from 'react';

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
  return (
    <>
      <aside>Sou uma sidebar legal</aside>
      <Suspense fallback={<p>Carregando...</p>}>
        <BarbershopData>{children}</BarbershopData>
      </Suspense>
    </>
  );
}

async function BarbershopData({ children }: { children: React.ReactNode }) {
  const [barbershopResponse, appointmentsResponse, employeesResponse] =
    await Promise.all([
      getBarbershopAction(),
      getAppointmentsAction(),
      getEmployeesAction(),
    ]);

  const { data: barbershop } = barbershopResponse;
  const { data: appointments } = appointmentsResponse;
  const { data: employees } = employeesResponse;

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
