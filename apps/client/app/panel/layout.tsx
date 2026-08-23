import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import getAppointmentsAction from '../actions/get-appointments';
import getEmployeesAction from '../actions/get-employees';
import getBarbershopAction from '../actions/get-barbershop';
import getServicesAction from '../actions/get-services';

import { PanelProvider } from '@/src/common/contexts/panel-context';
import { SidebarProvider } from '@/src/common/contexts/sidebar-context';

import Aside from './_components/Aside';
import Header from './_components/Header';

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
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Aside />
        <div className="max-lg:px-4 pb-4 pt-[calc(var(--header)+2.25rem)] lg:pl-[calc(var(--sidebar)+1rem)] lg:pr-4">
          <main className="max-w-300 w-full mx-auto">
            <Suspense
              fallback={<p className="p-4 text-center">Carregando...</p>}
            >
              <BarbershopData>{children}</BarbershopData>
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
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

  const barbershop = barbershopResponse.data;
  const appointments = appointmentsResponse?.data ?? [];
  const employees = employeesResponse?.data ?? [];
  const services = servicesResponse?.data ?? [];

  if (!barbershop) redirect('/login');

  return (
    <PanelProvider
      barbershopData={barbershop}
      appointmentsData={appointments}
      employeesData={employees}
      servicesData={services}
    >
      <Header />
      {children}
    </PanelProvider>
  );
}
