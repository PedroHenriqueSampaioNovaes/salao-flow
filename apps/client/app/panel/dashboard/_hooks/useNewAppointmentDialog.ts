'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import getAvailableTimeSlotsForBookingAction from '@/app/actions/get-available-time-slots-for-booking';
import getEmployeesAction from '@/app/actions/get-employees';

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
  const { barbershop, services, expedients } = usePanelContext();

  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error, ok } = await getEmployeesAction();

      if (!ok) {
        showErrorToast(error || 'Erro ao buscar profissionais.');
        return [];
      }

      return data ?? [];
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const methods = useForm<BookingFormSchema>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      employeeId: 0,
      serviceIds: [],
      date: '',
      time: '',
      name: '',
      phone: '',
      email: '',
    },
  });
  const { setValue } = methods;

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>();

  const selectedEmployee =
    employees.find((employee) => employee.id === selectedEmployeeId) ??
    employees[0];

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

  const selectedEmployeeServices = selectedEmployee?.services ?? [];

  const selectedEmployeeServicesWithDuration = services.filter((service) =>
    selectedEmployeeServices.some(
      (employeeService) => employeeService.id === service.id,
    ),
  );

  const selectedEmployeeSchedule = expedients.find(
    (expedient) => expedient.id === selectedEmployee?.employeeScheduleId,
  )?.employeeScheduleWeekdays;

  useEffect(() => {
    if (!selectedEmployee) return;

    setValue('employeeId', selectedEmployee.id);

    if (!timeSlotsByProfessionalAndDate) return;

    const employee = timeSlotsByProfessionalAndDate.employees.find(
      (employee) => employee.id === selectedEmployee.id,
    );
    if (!employee) return;

    setValue('date', employee.date);
  }, [selectedEmployee, timeSlotsByProfessionalAndDate, setValue]);

  const onSelectEmployee = (employeeId: number) => {
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
    !isLoadingEmployees &&
    !isLoadingSlots &&
    isFetchedAfterMount &&
    !!timeSlotsByProfessionalAndDate &&
    !!selectedEmployee;

  return {
    methods,
    barbershop,
    selectedEmployeeId: selectedEmployee?.id,
    selectedEmployeeServices,
    selectedEmployeeServicesWithDuration,
    selectedEmployeeSchedule,
    onSelectEmployee,
    timeSlotsByProfessionalAndDate,
    isFetchingSlots,
    refetchSlots,
    isReady,
    onSubmit,
  };
}
