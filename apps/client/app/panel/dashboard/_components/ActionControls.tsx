'use client';

import { IdCardLanyard } from 'lucide-react';

import {
  NativeSelect,
  NativeSelectOption,
} from '@/src/components/ui/native-select';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import NewAppointmentDialog from './NewAppointmentDialog';

interface ActionControlsProps {
  employee: number | '';
  onEmployeeChange: (employee: number) => void;
}

export default function ActionControls({
  employee,
  onEmployeeChange,
}: ActionControlsProps) {
  const { employees } = usePanelContext();

  return (
    <div className="p-4 px-4 md:px-6 flex flex-col sm:flex-row gap-3 border-b border-border/20">
      <NativeSelect
        Icon={IdCardLanyard}
        value={employee}
        onChange={(e) => {
          const value = e.target.value;
          onEmployeeChange(Number(value));
        }}
      >
        <NativeSelectOption value="">Todos os profissionais</NativeSelectOption>
        {employees.map((emp) => (
          <NativeSelectOption key={emp.id} value={emp.id}>
            {emp.name}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <NewAppointmentDialog />
    </div>
  );
}
