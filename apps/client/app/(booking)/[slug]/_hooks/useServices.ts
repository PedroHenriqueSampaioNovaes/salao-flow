'use client';

import { IEmployee } from '@/src/common/interfaces/barbershop-booking';

import { useBookingForm } from '../_contexts/BookingFormContext';

export function useServices(professionals: IEmployee[]) {
  const { form, goToPrevStep } = useBookingForm();
  const selectedEmployeeId = form.watch('employeeId');
  const selectedServiceIds = form.watch('serviceIds') || [];

  const selectedProfessional = professionals.find(
    (p) => p.id === selectedEmployeeId,
  );

  if (!selectedProfessional) {
    goToPrevStep();
  }

  const handleServiceToggle = (serviceId: string) => {
    let updatedServices = [...selectedServiceIds];
    if (updatedServices.includes(serviceId)) {
      updatedServices = updatedServices.filter((id) => id !== serviceId);
    } else {
      updatedServices.push(serviceId);
    }
    form.setValue('serviceIds', updatedServices, { shouldValidate: true });
  };

  return {
    selectedProfessional,
    selectedServiceIds,
    serviceIdsError: form.formState.errors.serviceIds,
    handleServiceToggle,
  };
}
