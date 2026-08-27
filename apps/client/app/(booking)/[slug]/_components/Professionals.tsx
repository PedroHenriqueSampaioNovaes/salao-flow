'use client';

import { AlertCircle, User } from 'lucide-react';

import {
  IBarbershopBookingInfos,
  IGetAvailableTimeSlotsForBooking,
} from '@/src/common/interfaces/barbershop-booking';

import { getLocalDateAsUTCDate } from '@/src/common/utils/getLocalDateAsUTCDate';

import { Alert, AlertDescription } from '@/src/components/ui/alert';

import { useBookingForm } from '../_contexts/BookingFormContext';

import ProfessionalItem from './ProfessionalItem';
import StepTitle from './StepTitle';

interface IProfessionalsProps {
  professionals: IBarbershopBookingInfos['employees'];
  barbershopBookingInfos: IBarbershopBookingInfos;
  employeesShiftData: IGetAvailableTimeSlotsForBooking['employees'];
}

export default function Professionals({
  professionals,
  barbershopBookingInfos,
  employeesShiftData,
}: IProfessionalsProps) {
  const { form } = useBookingForm();
  const selectedEmployeeId = form.watch('employeeId');

  const barbershopLocalDateUTC = getLocalDateAsUTCDate(
    barbershopBookingInfos.instantLocalTime,
    barbershopBookingInfos.timezone,
  );

  const handleEmployeeSelect = (id: number) => {
    if (selectedEmployeeId === id) return;

    const employeeShiftData = employeesShiftData.find(
      (employee) => employee.id === id,
    );

    form.setValue('serviceIds', []);
    form.setValue('employeeId', id, { shouldValidate: true });
    form.setValue('date', employeeShiftData?.date ?? '');
    form.setValue('time', '');
  };

  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
      <StepTitle title="Escolha seu Profissional" icon={User} />

      {form.formState.errors.employeeId && (
        <Alert variant="warning" className="mb-4 sticky top-2.5">
          <AlertCircle className="size-6" />
          <AlertDescription>
            {form.formState.errors.employeeId.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-6">
        {professionals.map((employee) => {
          return (
            <ProfessionalItem
              key={employee.id}
              employee={employee}
              isSelected={selectedEmployeeId === employee.id}
              onSelect={handleEmployeeSelect}
              employeesShiftData={employeesShiftData}
              barbershopLocalDateUTC={barbershopLocalDateUTC}
            />
          );
        })}
      </div>
    </div>
  );
}
