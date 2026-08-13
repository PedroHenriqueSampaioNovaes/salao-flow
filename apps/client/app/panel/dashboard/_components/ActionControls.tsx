'use client';

import { CalendarPlus2, IdCardLanyard } from 'lucide-react';

import {
  NativeSelect,
  NativeSelectOption,
} from '@/src/components/ui/native-select';

import { usePanelContext } from '@/src/common/contexts/panel-context';

interface ActionControlsProps {
  employee: number | '';
  onEmployeeChange: (employee: number | '') => void;
}

export default function ActionControls({
  employee,
  onEmployeeChange,
}: ActionControlsProps) {
  const { employees } = usePanelContext();

  return (
    <div className="p-4 px-4 md:px-6 flex flex-col sm:flex-row items-center gap-3">
      <NativeSelect
        Icon={IdCardLanyard}
        value={employee}
        onChange={(e) => {
          const value = e.target.value;
          onEmployeeChange(value === '' ? '' : Number(value));
        }}
      >
        <NativeSelectOption value="">Todos os profissionais</NativeSelectOption>
        {employees.map((emp) => (
          <NativeSelectOption key={emp.id} value={emp.id}>
            {emp.name}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <button className="w-full bg-brand-accent hover:bg-accent text-white font-semibold py-2.5 px-6 rounded-md flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-colors cursor-pointer">
        <CalendarPlus2 className="size-4" />
        <span>Novo Agendamento</span>
      </button>
    </div>
  );
}
