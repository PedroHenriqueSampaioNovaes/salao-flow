import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import Dashboard from '@/app/panel/dashboard/_components/Dashboard';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const apiUrl = process.env.API_URL || 'http://localhost:3333';

  if (!token) redirect('/login');

  return <Dashboard token={token} apiUrl={apiUrl} />;
}
