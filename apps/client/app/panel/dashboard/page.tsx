import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import getDashboardMetricsAction from '@/app/actions/get-dashboard-metrics';

import Dashboard from '@/app/panel/dashboard/_components/Dashboard';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const apiUrl = process.env.API_URL || 'http://localhost:3333';

  const { data: dashboardMetrics } = await getDashboardMetricsAction();

  if (!token || !dashboardMetrics) redirect('/login');

  return (
    <Dashboard
      token={token}
      apiUrl={apiUrl}
      dashboardMetrics={dashboardMetrics}
    />
  );
}
