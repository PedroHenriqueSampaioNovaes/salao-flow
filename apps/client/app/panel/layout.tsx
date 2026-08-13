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

const defaultEmployees = [
  { id: 1, name: 'Carlos Cabeleireiro', image: '', employeeScheduleId: '1' },
];

const defaultAppointments = [
  {
    id: '1',
    date: '2026-07-23T17:00:00.000Z',
    customer: { id: 101, name: 'Pedro Henrique', phone: '(11) 91111-1111' },
    employee: { id: 1, name: 'Carlos Cabeleireiro' },
    services: [{ name: 'Corte + Barba, Barba Terapia', price: 3000 }],
  },
  {
    id: '2',
    date: '2026-07-23T17:30:00.000Z',
    customer: { id: 102, name: 'Pedro Henrique', phone: '(11) 91111-1111' },
    employee: { id: 1, name: 'Carlos Cabeleireiro' },
    services: [{ name: 'Corte + Barba, Barba Terapia', price: 3000 }],
  },
];

import { IService } from '@/src/common/interfaces/service';

const defaultServices: IService[] = [
  {
    id: '1',
    barbershop_id: 1,
    name: 'Corte + Barba, Barba Terapia',
    description: null,
    price: 3000,
    duration: 30,
    status: true,
    assignToAllEmployees: true,
    employees: [{ id: 1, name: 'Carlos Cabeleireiro' }],
  },
];

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
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
  const appointments =
    appointmentsResponse?.data && appointmentsResponse.data.length > 0
      ? appointmentsResponse.data
      : defaultAppointments;
  const employees =
    employeesResponse?.data && employeesResponse.data.length > 0
      ? employeesResponse.data
      : defaultEmployees;
  const services =
    servicesResponse?.data && servicesResponse.data.length > 0
      ? servicesResponse.data
      : defaultServices;

  if (!barbershop) redirect('/login');

  return (
    <PanelProvider
      barbershopData={barbershop}
      appointmentsData={appointments}
      employeesData={employees}
      servicesData={services}
    >
      {children}
    </PanelProvider>
  );
}
