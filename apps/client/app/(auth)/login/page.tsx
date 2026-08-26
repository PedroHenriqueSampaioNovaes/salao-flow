import { Metadata } from 'next';
import { LoginForm } from './_components/LoginForm';

export const metadata: Metadata = {
  title: 'Faça Login | SalaoFlow',
  description:
    'Entre e gerencie agendamentos, clientes e serviços de forma simples e eficiente.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <LoginForm />
    </main>
  );
}
