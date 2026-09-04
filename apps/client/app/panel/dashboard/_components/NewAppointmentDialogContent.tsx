'use client';

import Link from 'next/link';
import {
  Calendar,
  CalendarClock,
  CalendarPlus2,
  Mail,
  Phone,
  RefreshCw,
  Scissors,
  User,
  Users,
} from 'lucide-react';
import { Controller, FormProvider } from 'react-hook-form';

import { DialogContent } from '@/src/components/ui/dialog';
import {
  FormDialogFooter,
  FormDialogHeader,
} from '@/src/components/ui/form-dialog-content';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import Loading from '@/src/components/ui/loading';

import {
  NativeSelect,
  NativeSelectOption,
} from '@/src/components/ui/native-select';
import { PhoneInputField } from '@/src/components/ui/phone-input-field';
import { MultiSelect } from '@/src/components/ui/multi-select';
import InputDateBookingByProfessional from '@/src/components/ui/input-date-booking-by-professional';
import SelectionTimeSlotsBooking from '@/src/components/ui/selection-time-slots-booking';

import { cn } from '@/src/lib/utils';

import { useNewAppointmentDialog } from '../_hooks/useNewAppointmentDialog';

interface INewAppointmentDialogContentProps {
  closeDialog: () => void;
}

export default function NewAppointmentDialogContent({
  closeDialog,
}: INewAppointmentDialogContentProps) {
  const {
    methods,
    barbershop,
    selectedEmployeeId,
    selectedEmployeeServices,
    onSelectEmployee,
    timeSlotsByProfessionalAndDate,
    isFetchingSlots,
    refetchSlots,
    isReady,
    onSubmit,
  } = useNewAppointmentDialog({ closeDialog });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  if (!isReady || !timeSlotsByProfessionalAndDate) {
    return (
      <DialogContent showCloseButton={false}>
        <div className="flex items-center justify-center py-16">
          <Loading />
        </div>
      </DialogContent>
    );
  }

  return (
    <FormProvider {...methods}>
      <DialogContent showCloseButton={false}>
        <FormDialogHeader
          Icon={CalendarPlus2}
          title="Novo Agendamento"
          description="Preencha os dados do atendimento."
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="customer-name" Icon={User}>
                Nome do cliente
              </FieldLabel>
              <Input
                id="customer-name"
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              <FieldError>{errors.name?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email" Icon={Mail}>
                E-mail do cliente
              </FieldLabel>
              <Input
                id="email"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              <FieldError>{errors.email?.message}</FieldError>
            </Field>

            <PhoneInputField
              id="phone"
              label="Telefone"
              name="phone"
              control={control}
              error={errors.phone?.message}
              placeholder="(11) 90000-0000"
              Icon={Phone}
            />

            <Field data-invalid={!!errors.employeeId}>
              <FieldLabel htmlFor="professional" Icon={Users}>
                Profissional
              </FieldLabel>
              <NativeSelect
                id="professional"
                value={selectedEmployeeId}
                onChange={(e) => onSelectEmployee(Number(e.target.value))}
              >
                {timeSlotsByProfessionalAndDate.employees.map((emp) => (
                  <NativeSelectOption key={emp.id} value={emp.id}>
                    {emp.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              <FieldError>{errors.employeeId?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.serviceIds}>
              <FieldLabel htmlFor="services" Icon={Scissors}>
                Serviços
              </FieldLabel>
              <Controller
                name="serviceIds"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    id="services"
                    options={selectedEmployeeServices.map((service) => ({
                      value: String(service.id),
                      label: service.name,
                    }))}
                    selected={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Selecione os serviços..."
                    ariaInvalid={!!errors.serviceIds}
                  />
                )}
              />
              <FieldError>{errors.serviceIds?.message}</FieldError>
              <FieldDescription>
                Se nenhum serviço estiver disponível, crie em{' '}
                <Link href="/panel/services" className="link">
                  serviços
                </Link>
                .
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="date" Icon={Calendar}>
                Dia
              </FieldLabel>
              <InputDateBookingByProfessional
                timeSlotsByProfessionalAndDate={timeSlotsByProfessionalAndDate}
              />
            </Field>

            <Field>
              <div className="flex items-center justify-between mb-1">
                <FieldLabel Icon={CalendarClock}>
                  Selecione um horário disponível:
                </FieldLabel>
                <button
                  type="button"
                  title="Atualizar horários disponíveis"
                  className="cursor-pointer text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => refetchSlots()}
                  disabled={isFetchingSlots}
                >
                  <RefreshCw
                    className={cn(
                      'size-5',
                      isFetchingSlots ? 'animate-spin' : '',
                    )}
                  />
                </button>
              </div>

              <SelectionTimeSlotsBooking
                slug={barbershop.slug}
                employeesShift={timeSlotsByProfessionalAndDate.employees}
                isLoadingData={isFetchingSlots}
              />
              <FieldError>{errors.time?.message}</FieldError>
            </Field>
          </FieldGroup>

          <FormDialogFooter
            submitLabel="Criar Agendamento"
            isSubmitting={isSubmitting}
          />
        </form>
      </DialogContent>
    </FormProvider>
  );
}
