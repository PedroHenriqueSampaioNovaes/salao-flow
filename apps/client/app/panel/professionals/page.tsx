import { Metadata } from 'next';

import Professionals from './_components/Professionals';

export const metadata: Metadata = {
  title: 'SalãoFlow',
  description:
    'Gerencie agendamentos, clientes e serviços de forma simples e eficiente.',
};

export default function ProfessionalsPage() {
  return <Professionals />;
}
