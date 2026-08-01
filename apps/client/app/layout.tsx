import type { Metadata } from 'next';
import { Arimo } from 'next/font/google';
import './globals.css';

const arimo = Arimo({
  variable: '--font-arimo',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SalãoFlow',
  description:
    'Tenha um site personalizado para agendamento online e divulgação do seu estabelecimento. Teste grátis por 30 dias!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${arimo.variable} h-full antialiased bg-zinc-950`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
