'use client';

import {
  Control,
  Controller,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';
import { EmployeeScheduleSchema } from '@sistema-barbearia/validators';

import { cn } from '@/src/lib/utils';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Input } from '@/src/components/ui/input';

import { LunchToggle } from './LunchToggle';

const WEEKDAY_INFOS = [
  { name: 'Segunda-feira', weekdayIndex: 1 },
  { name: 'Terça-feira', weekdayIndex: 2 },
  { name: 'Quarta-feira', weekdayIndex: 3 },
  { name: 'Quinta-feira', weekdayIndex: 4 },
  { name: 'Sexta-feira', weekdayIndex: 5 },
  { name: 'Sábado', weekdayIndex: 6 },
  { name: 'Domingo', weekdayIndex: 7 },
];

const timeInputClassName =
  'w-fit h-auto bg-white px-3 py-1.5 text-center text-sm';

interface IExpedientWeekdayFieldsProps {
  control: Control<EmployeeScheduleSchema>;
  register: UseFormRegister<EmployeeScheduleSchema>;
  watch: UseFormWatch<EmployeeScheduleSchema>;
}

export function ExpedientWeekdayFields({
  control,
  register,
  watch,
}: IExpedientWeekdayFieldsProps) {
  return (
    <div className="flex flex-col gap-3">
      {WEEKDAY_INFOS.map(({ name, weekdayIndex }) => {
        const weekdays = watch('weekdays');
        const index = weekdays.findIndex(
          ({ weekday }) => weekday === weekdayIndex,
        );
        const isWorkingDay = weekdays[index].isWorkingDay;
        const hasLunch =
          weekdays[index].startLunch != null ||
          weekdays[index].endLunch != null;

        return (
          <div
            key={name}
            className={cn(
              'rounded-xl p-4 transition-colors',
              isWorkingDay ? 'bg-background' : 'bg-secondary/4',
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <Controller
                  name={`weekdays.${index}.isWorkingDay`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <span className="text-sm font-semibold">{name}</span>
              </label>

              {!isWorkingDay && (
                <span className="text-sm text-neutral font-medium">Folga</span>
              )}
            </div>

            {isWorkingDay && (
              <div className="mt-3 flex flex-col gap-2.5 min-[350px]:pl-7">
                <div className="flex items-center flex-wrap gap-3">
                  <span className="w-full min-[450px]:w-20 shrink-0 text-xs text-neutral font-medium">
                    Expediente
                  </span>
                  <Input
                    type="time"
                    className={timeInputClassName}
                    {...register(`weekdays.${index}.start`)}
                  />
                  <span className="text-xs text-neutral font-medium">às</span>
                  <Input
                    type="time"
                    className={timeInputClassName}
                    {...register(`weekdays.${index}.end`)}
                  />
                </div>

                <div className="flex items-center flex-wrap gap-3">
                  <LunchToggle control={control} index={index} />
                  {!hasLunch && (
                    <span className="text-xs text-neutral font-medium">
                      Sem pausa para almoço
                    </span>
                  )}
                  {hasLunch && (
                    <>
                      <Input
                        type="time"
                        className={timeInputClassName}
                        {...register(`weekdays.${index}.startLunch`)}
                      />
                      <span className="text-xs text-neutral font-medium">
                        às
                      </span>
                      <Input
                        type="time"
                        className={timeInputClassName}
                        {...register(`weekdays.${index}.endLunch`)}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
