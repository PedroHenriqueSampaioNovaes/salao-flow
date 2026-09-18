import { Metadata } from 'next';

import { RecruiterAccountCard } from './_components/RecruiterAccountCard';

export const metadata: Metadata = {
  title: 'Acesso para Recrutadores | SalaoFlow',
  description:
    'Crie uma conta de demonstração para conhecer o SalaoFlow por 24 horas.',
};

export default function RecruiterPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      <RecruiterAccountCard />
    </main>
  );
}
