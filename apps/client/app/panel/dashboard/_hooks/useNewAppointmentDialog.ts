'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import getAvailableTimeSlotsForBookingAction from '@/app/actions/get-available-time-slots-for-booking';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

import {
  bookingFormSchema,
  BookingFormSchema,
} from '@/src/common/schemas/booking';
import createAppointmentAction from '@/app/actions/create-appointment';

interface IUseNewAppointmentDialogParams {
  closeDialog: () => void;
}

export function useNewAppointmentDialog({
  closeDialog,
}: IUseNewAppointmentDialogParams) {
  const { employees, services, barbershop } = usePanelContext();

  const methods = useForm<BookingFormSchema>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      employeeId: employees[0].id,
      serviceIds: [],
      date: '',
      time: '',
      name: '',
      phone: '',
      email: '',
    },
  });
  const { setValue } = methods;

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(employees[0].id);

  const {
    data: timeSlotsByProfessionalAndDate,
    isLoading: isLoadingSlots,
    isFetching: isFetchingSlots,
    refetch: refetchSlots,
    isFetchedAfterMount,
  } = useQuery({
    queryKey: ['availableSlots', barbershop.slug],
    queryFn: async () => {
      const { data, error, ok } = await getAvailableTimeSlotsForBookingAction({
        slug: barbershop.slug,
      });

      if (!ok) {
        showErrorToast(error || 'Erro ao buscar horários disponíveis.');
        return;
      }

      return data;
    },
    refetchOnMount: 'always',
  });

  const selectedEmployeeServices = services.filter(
    (service) =>
      service.assignToAllEmployees ||
      service.employees.some((employee) => employee.id === selectedEmployeeId),
  );

  useEffect(() => {
    if (!timeSlotsByProfessionalAndDate) return;

    const employee = timeSlotsByProfessionalAndDate.employees.find(
      (employee) => employee.id === selectedEmployeeId,
    );
    if (!employee) return;

    setValue('date', employee.date);
  }, [selectedEmployeeId, timeSlotsByProfessionalAndDate, setValue]);

  const selectEmployee = (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
    setValue('serviceIds', []);
    setValue('employeeId', employeeId);
    setValue('time', '');
  };

  const onSubmit: SubmitHandler<BookingFormSchema> = async (data) => {
    const { error, ok } = await createAppointmentAction({
      ...data,
      barbershopSlug: barbershop.slug,
    });

    if (!ok) {
      showErrorToast(error || 'Erro ao realizar agendamento.');
      return;
    }

    showSuccessToast('Agendamento realizado com sucesso!');
    closeDialog();
  };

  const isReady =
    !isLoadingSlots && isFetchedAfterMount && !!timeSlotsByProfessionalAndDate;

  return {
    methods,
    barbershop,
    selectedEmployeeId,
    selectedEmployeeServices,
    selectEmployee,
    timeSlotsByProfessionalAndDate,
    isFetchingSlots,
    refetchSlots,
    isReady,
    onSubmit,
  };
}
