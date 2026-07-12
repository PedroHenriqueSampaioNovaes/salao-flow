import Image from 'next/image';

import { formatPrice } from '@/src/common/utils/formatPrice';

import {
  IEmployee,
  IGetAvailableTimeSlotsForBooking,
} from '@/src/common/interfaces/barbershop-booking';

interface IProfessionalsProps {
  professionals: IEmployee[];
  barbershopLocalDateUTC: Date;
  employeesShiftData: IGetAvailableTimeSlotsForBooking['employees'];
}

export default function Professionals({
  professionals,
  barbershopLocalDateUTC,
  employeesShiftData,
}: IProfessionalsProps) {
  return (
    <>
      <h2>Escolha seu Profissional</h2>
      {professionals.map(({ id, name, image, services }) => {
        const employeeShift = employeesShiftData.find(
          ({ id: employeeId }) => employeeId === id,
        );

        if (!employeeShift) {
          return <p key={id}>Não foi possível encontrar o profissional.</p>;
        }

        const firstAvailableSlot = employeeShift.availableSlots[0];
        const employeeShiftDate = new Date(employeeShift.date);

        function getMessage() {
          if (!firstAvailableSlot) {
            return 'Nenhum horário disponível foi encontrado nos próximos 10 dias pesquisados';
          }

          const isToday =
            barbershopLocalDateUTC.getUTCDate() ===
              employeeShiftDate.getUTCDate() &&
            barbershopLocalDateUTC.getUTCMonth() ===
              employeeShiftDate.getUTCMonth();

          const tomorrow = new Date(
            barbershopLocalDateUTC.getTime() + 24 * 60 * 60 * 1000,
          );

          const isTomorrow =
            employeeShiftDate.getUTCDate() === tomorrow.getUTCDate() &&
            employeeShiftDate.getUTCMonth() === tomorrow.getUTCMonth();

          if (isToday) return `Hoje às ${firstAvailableSlot}`;
          if (isTomorrow) return `Amanhã às ${firstAvailableSlot}`;

          return `${employeeShiftDate.getUTCDate()}/${employeeShiftDate.getUTCMonth() + 1}/${employeeShiftDate.getUTCFullYear()} às ${firstAvailableSlot}`;
        }

        return (
          <div key={id}>
            <Image
              className="rounded-full"
              width={64}
              height={64}
              src={image}
              alt={name}
              loading="eager"
            />
            <h2>{name}</h2>
            {services.map(({ id, name, duration, price }) => (
              <div key={id} className="flex gap-20">
                <span>{name}</span>
                <span>{duration} minutos</span>
                <span>{formatPrice(price)}</span>
              </div>
            ))}
            <p>Próximo Horário: {getMessage()}</p>
          </div>
        );
      })}
    </>
  );
}
