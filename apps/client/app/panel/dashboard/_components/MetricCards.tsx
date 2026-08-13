import { Calendar, Scissors, TrendingUp, User, Users } from 'lucide-react';

import { usePanelContext } from '@/src/common/contexts/panel-context';

export default function MetricCards() {
  const { employees, services } = usePanelContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Card 1: Total de clientes */}
      <div className="bg-white rounded-2xl p-4 shadow shadow-neutral/20 flex flex-col gap-1">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#deddf0] flex items-center justify-center shrink-0">
              <Users className="size-6 text-[#665BFF]" />
            </div>
            <span className="font-bold text-neutral">Total de clientes</span>
          </div>
          <div className="text-3xl lg:text-4xl font-bold text-black leading-none">
            20
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-secondary font-medium">
            Em relação ao último mês
          </span>
          <div className="bg-badge-green-bg text-badge-green-text text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-2">
            <TrendingUp className="size-3.5" />
            <span>+4.8%</span>
          </div>
        </div>
      </div>

      {/* Card 2: Atendimentos hoje */}
      <div className="bg-white rounded-2xl p-4 shadow shadow-neutral/20 flex flex-col gap-1">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#D9E2EF] flex items-center justify-center shrink-0">
              <Calendar className="size-6 text-[#3684FD]" />
            </div>
            <span className="font-bold text-neutral">Atendimentos hoje</span>
          </div>
          <div className="text-3xl lg:text-4xl font-bold text-black leading-none">
            6
          </div>
        </div>
      </div>

      {/* Card 3: Total de funcionários */}
      <div className="bg-white rounded-2xl p-4 shadow shadow-neutral/20 flex flex-col gap-1">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#D9ECF2] flex items-center justify-center shrink-0">
              <User className="size-6 text-[#39778B]" />
            </div>
            <span className="font-bold text-neutral">
              Total de funcionários
            </span>
          </div>
          <div className="text-3xl lg:text-4xl font-bold text-black leading-none">
            {employees.length}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-secondary font-medium">
            Em relação ao último mês
          </span>
          <div className="bg-badge-red-bg text-badge-red-text text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-2">
            <TrendingUp className="size-3.5 -rotate-180" />
            <span>-2%</span>
          </div>
        </div>
      </div>

      {/* Card 4: Total de serviços */}
      <div className="bg-white rounded-2xl p-4 shadow shadow-neutral/20 flex flex-col gap-1">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#DBE1F4] flex items-center justify-center shrink-0">
              <Scissors className="size-6 text-[#334994]" />
            </div>
            <span className="font-bold text-neutral">Total de serviços</span>
          </div>
          <div className="text-3xl lg:text-4xl font-bold text-black leading-none">
            {services.length}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-secondary font-medium">
            Em relação ao último mês
          </span>
          <div className="bg-badge-green-bg text-badge-green-text text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-2">
            <TrendingUp className="size-3.5" />
            <span>+4.8%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
