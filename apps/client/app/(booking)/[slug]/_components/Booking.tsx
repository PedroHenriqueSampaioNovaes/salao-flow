'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

import { IGetAvailableTimeSlotsForBooking } from '@/src/common/interfaces/barbershop-booking';

import getAvailableTimeSlotsForBookingAction from '@/app/actions/get-available-time-slots-for-booking';
import createAppointmentAction from '@/app/actions/create-appointment';

import { FieldLabel } from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';

interface IBookingProps {
  barbershopLocalDateUTC: Date;
  availableTimeSlots: IGetAvailableTimeSlotsForBooking;
}

export default function Booking({
  barbershopLocalDateUTC,
  availableTimeSlots,
}: IBookingProps) {
  const { slug } = useParams() as { slug: string };

  const minimumInputDate = availableTimeSlots.date;

  const maxInputDate = new Date(
    barbershopLocalDateUTC.getUTCFullYear(),
    barbershopLocalDateUTC.getUTCMonth(),
    barbershopLocalDateUTC.getUTCDate() + 90,
  ).toLocaleDateString('en-CA');

  const [date, setDate] = useState(minimumInputDate);
  const [times, setTimes] = useState<string[]>(() => {
    const employeeShift = availableTimeSlots.employees.find(
      ({ id: employeeId }) => employeeId === 2, //! POR ENQUANTO SÓ ESTÁ BUSCANDO PELA AGENDA DO FUNCIONÁRIO CAIO
    );

    if (!employeeShift) return [];

    return employeeShift.availableSlots;
  });
  const [selectedTime, setSelectedTime] = useState('');

  async function handleInputDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value;
    const targetDate = new Date(inputValue);
    if (
      barbershopLocalDateUTC.getUTCDate() > targetDate.getUTCDate() &&
      barbershopLocalDateUTC.getMonth() >= targetDate.getUTCMonth()
    ) {
      return;
    }

    const {
      data: availableTimeSlots,
      ok,
      error,
    } = await getAvailableTimeSlotsForBookingAction({
      slug,
      dateString: inputValue,
      employeeId: 2, //! POR ENQUANTO SÓ ESTÁ BUSCANDO PELA AGENDA DO FUNCIONÁRIO CAIO
      lookForNextAvailableTimeSlot: 1,
    });

    if (!ok) {
      alert(error || 'Erro ao buscar horários disponíveis.');
      setTimes([]);
      return;
    }

    const employee = availableTimeSlots.employees[0];

    setTimes(employee.availableSlots);
    setDate(inputValue);
  }

  return (
    <>
      <h2>Selecione dia e hora para agendar</h2>

      <FieldLabel htmlFor="date">Dia:</FieldLabel>
      <Input
        id="date"
        type="date"
        value={date}
        onChange={handleInputDateChange}
        min={minimumInputDate}
        max={maxInputDate}
      />

      <FieldLabel>Selecione um Horário Disponível:</FieldLabel>
      {times.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {times.map((time) => (
            <button
              className="w-20 h-10 rounded-xl border-border-200 border shadow-lg bg-background-white"
              key={time}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>
      ) : (
        <p>
          Nenhum horário disponível para esta data. Por favor, troque a data ou
          verifique com outro profissional
        </p>
      )}
      <button
        onClick={async () => {
          const { error, ok } = await createAppointmentAction({
            name: 'Pedro',
            phone: '(11) 98814-8020',
            barbershopSlug: 'teste-do-pedrão-maneirão',
            employeeId: 2,
            serviceIds: [
              '00dc745f-9e2a-4dfb-a58e-7a0d4b594ab7',
              '3d6d8564-8f86-4871-a5d8-63ceda6610b1',
              '10b03ffa-54de-4d25-acd0-830f5ab8d783',
            ],
            date,
            time: selectedTime,
          });

          if (!ok) alert(error);
        }}
      >
        Submeter
      </button>
    </>
  );
}
