import { Metadata } from 'next';
import { ForgotPasswordForm } from './_components/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Esqueci minha senha | SalaoFlow',
  description: 'Informe seu e-mail para redefinir sua senha.',
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <ForgotPasswordForm />
    </main>
  );
}
