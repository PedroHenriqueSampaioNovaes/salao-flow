import { Metadata } from 'next';
import Link from 'next/link';

import { ResetPasswordForm } from './_components/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Redefinir senha | SalaoFlow',
  description: 'Defina uma nova senha para acessar sua conta.',
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[0_1px_3px_rgba(73,81,93,0.2)] flex flex-col gap-4 text-center">
          <h1 className="text-2xl font-bold text-tertiary leading-none">
            Link inválido
          </h1>
          <p className="text-sm text-primary">
            Este link de redefinição de senha é inválido ou expirou. Solicite
            um novo link para continuar.
          </p>
          <Link href="/forgot-password" className="link">
            Solicitar novo link
          </Link>
        </div>
      )}
    </main>
  );
}
