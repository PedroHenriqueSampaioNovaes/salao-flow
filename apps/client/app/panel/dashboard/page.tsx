import { Metadata } from 'next';

import Dashboard from '@/app/panel/dashboard/_components/Dashboard';

export const metadata: Metadata = {
  title: 'Dashboard | SalãoFlow',
  description:
    'Gerencie agendamentos, clientes e serviços de forma simples e eficiente.',
};

export default function DashboardPage() {
  return <Dashboard />;
}
