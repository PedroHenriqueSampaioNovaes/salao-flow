import { Metadata } from 'next';
import { Suspense } from 'react';

import getAppointmentsAction from '../actions/get-appointments';
import getEmployeesAction from '../actions/get-employees';
import getBarbershopAction from '../actions/get-barbershop';
import getServicesAction from '../actions/get-services';

import { PanelProvider } from '@/src/common/contexts/panel-context';

import Aside from './_components/Aside';

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
    <div className="grid grid-cols-[260px_1fr]">
      <Aside />
      <Suspense fallback={<p>Carregando...</p>}>
        <BarbershopData>{children}</BarbershopData>
      </Suspense>
    </div>
  );
}

async function BarbershopData({ children }: { children: React.ReactNode }) {
  const [
    barbershopResponse,
    appointmentsResponse,
    employeesResponse,
    servicesResponse,
  ] = await Promise.all([
    getBarbershopAction(),
    getAppointmentsAction(),
    getEmployeesAction(),
    getServicesAction(),
  ]);

  const { data: barbershop } = barbershopResponse;
  const { data: appointments } = appointmentsResponse;
  const { data: employees } = employeesResponse;
  const { data: services } = servicesResponse;

  if (!barbershop) {
    return (
      <h1>
        Desculpe, não foi possível buscar os dados de sua barbearia. Tente fazer
        o login novamente!
      </h1>
    );
  }

  return (
    <PanelProvider
      barbershopData={barbershop}
      appointmentsData={appointments ?? []}
      employeesData={employees ?? []}
      servicesData={services ?? []}
    >
      {children}
    </PanelProvider>
  );
}
