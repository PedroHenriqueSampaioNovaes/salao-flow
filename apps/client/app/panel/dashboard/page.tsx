import { cookies } from 'next/headers';

import Dashboard from '@/app/panel/dashboard/_components/Dashboard';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const apiUrl = process.env.API_URL || 'http://localhost:3333';

  return <Dashboard token={token} apiUrl={apiUrl} />;
}
