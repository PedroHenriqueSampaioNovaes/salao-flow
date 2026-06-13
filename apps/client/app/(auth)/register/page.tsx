import { RegisterForm } from './_components/RegisterForm';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crie Sua Conta | SalaoFlow',
  description:
    'Gerencie agendamentos, clientes e serviços de forma simples e eficiente.',
};

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      <RegisterForm />
    </main>
  );
}
