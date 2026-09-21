'use client';

import { Control, useController } from 'react-hook-form';
import { EmployeeScheduleSchema } from '@sistema-barbearia/validators';

import { Checkbox } from '@/src/components/ui/checkbox';

const DEFAULT_START_LUNCH = '12:00';
const DEFAULT_END_LUNCH = '13:00';

interface ILunchToggleProps {
  control: Control<EmployeeScheduleSchema>;
  index: number;
}

export function LunchToggle({ control, index }: ILunchToggleProps) {
  const { field: startLunch } = useController({
    name: `weekdays.${index}.startLunch`,
    control,
  });
  const { field: endLunch } = useController({
    name: `weekdays.${index}.endLunch`,
    control,
  });

  function handleCheckedChange(checked: boolean) {
    startLunch.onChange(checked ? DEFAULT_START_LUNCH : null);
    endLunch.onChange(checked ? DEFAULT_END_LUNCH : null);
  }

  return (
    <label className="w-full min-[450px]:w-20 shrink-0 flex items-center gap-2 cursor-pointer">
      <Checkbox
        checked={startLunch.value != null}
        onCheckedChange={handleCheckedChange}
      />
      <span className="text-xs text-neutral font-medium">Almoço</span>
    </label>
  );
}
