import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import getAppointmentsAction from '../actions/get-appointments';
import getEmployeesAction from '../actions/get-employees';
import getBarbershopAction from '../actions/get-barbershop';
import getServicesAction from '../actions/get-services';
import getExpedientsAction from '../actions/get-expedients';
import getBlockedTimesAction from '../actions/get-blocked-times';

import { IBarbershop } from '@/src/common/interfaces/barbershop';

import { PanelProvider } from '@/src/common/contexts/panel-context';
import { SidebarProvider } from '@/src/common/contexts/sidebar-context';

import Aside from './_components/Aside';
import Header from './_components/Header';
import LoadingScreen from '@/src/components/ui/loading-screen';

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
  const barbershopResponse = await getBarbershopAction();
  const barbershop = barbershopResponse.data;

  if (!barbershop) redirect('/login');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Aside />
        <Header barbershop={barbershop} />
        <div className="max-lg:px-4 pb-4 pt-[calc(var(--header)+2.25rem)] lg:pl-[calc(var(--sidebar)+1rem)] lg:pr-4">
          <main className="max-w-300 w-full mx-auto">
            <Suspense fallback={<LoadingScreen message="Carregando..." />}>
              <PanelData barbershop={barbershop}>{children}</PanelData>
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

async function PanelData({
  barbershop,
  children,
}: {
  barbershop: IBarbershop;
  children: React.ReactNode;
}) {
  const [
    appointmentsResponse,
    employeesResponse,
    servicesResponse,
    expedientsResponse,
    blockedTimesResponse,
  ] = await Promise.all([
    getAppointmentsAction(),
    getEmployeesAction(),
    getServicesAction(),
    getExpedientsAction(),
    getBlockedTimesAction(),
  ]);

  const appointments = appointmentsResponse?.data ?? [];
  const employees = employeesResponse?.data ?? [];
  const services = servicesResponse?.data ?? [];
  const expedients = expedientsResponse?.data ?? [];
  const blockedTimes = blockedTimesResponse?.data ?? [];

  return (
    <PanelProvider
      barbershopData={barbershop}
      appointmentsData={appointments}
      employeesData={employees}
      servicesData={services}
      expedientsData={expedients}
      blockedTimesData={blockedTimes}
    >
      {children}
    </PanelProvider>
  );
}
