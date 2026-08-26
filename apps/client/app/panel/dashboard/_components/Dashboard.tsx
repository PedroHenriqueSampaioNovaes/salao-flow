'use client';

import { IDashboardMetrics } from '@/src/common/interfaces/barbershop';

import { useDashboardMetrics } from '../_hooks/useDashboardMetrics';

import MetricCards from './MetricCards';
import Calendar from './Calendar';
import BookingLink from './BookingLink';

interface DashboardProps {
  token: string;
  apiUrl: string;
  initialDashboardMetrics: IDashboardMetrics;
}

export default function Dashboard({
  token,
  apiUrl,
  initialDashboardMetrics,
}: DashboardProps) {
  const { barbershop, dashboardMetrics, currentDateFormatted } =
    useDashboardMetrics({
      token,
      apiUrl,
      initialDashboardMetrics,
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Bem-vindo, {barbershop?.name}!
        </h1>
        <p className="text-sm text-primary mt-1 font-normal">
          {currentDateFormatted}
        </p>
      </div>

      <MetricCards dashboardMetrics={dashboardMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_350px] gap-5 items-start">
        <Calendar />
        <BookingLink />
      </div>
    </div>
  );
}
