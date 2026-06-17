'use client';

import { useState } from 'react';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { IAppointment } from '@/app/actions/get-appointments';

import { formatPrice } from '@/src/common/utils/formatPrice';

export default function Dashboard() {
  const { barbershop, appointments, employees } = usePanelContext();

  const [date, setDate] = useState(new Date());
  const [employee, setEmployee] = useState<number | ''>('');

  const appointmentsOfCurrentDate = filterAppointments(
    appointments,
    employee,
    date,
  );

  return (
    <div>
      <h1 className="text-xl">Dashboard:</h1>
      <p>{`www.salaoflow.com/${barbershop?.slug}`}</p>
      <button
        className="cursor-pointer mr-20"
        onClick={() => setDate(new Date())}
      >
        Hoje
      </button>{' '}
      <button
        className="cursor-pointer"
        onClick={() =>
          setDate(() => {
            const date = new Date();
            date.setDate(3);
            return date;
          })
        }
      >
        Dia 03
      </button>
      <div>
        <span>Funcionários:</span>
        <button className="cursor-pointer ml-5" onClick={() => setEmployee('')}>
          Todos profissionais
        </button>
        {employees.map((employee) => (
          <button
            key={employee.id}
            className="cursor-pointer ml-5"
            onClick={() => setEmployee(employee.id)}
          >
            {employee.name}
          </button>
        ))}
      </div>
      {appointmentsOfCurrentDate.map(({ id, date, services, employee }) => (
        <div key={id}>
          Data: {date}{' '}
          <span className="ml-5">
            Serviços:{' '}
            {services.map(({ name }) => (
              <span key={name}>{name}</span>
            ))}
            Valor total:
            {formatPrice(
              services.reduce((acc, service) => acc + service.price, 0),
            )}
          </span>
          <span className="ml-5">Profissional: {employee.name}</span>
        </div>
      ))}
    </div>
  );
}

function filterAppointments(
  appointments: IAppointment[],
  employeeId: number | '',
  date: Date,
) {
  return appointments?.filter(({ date: appointmentDate, employee }) => {
    const appointment = new Date(appointmentDate);
    const isSameDate = appointment.toDateString() === date.toDateString();
    const isSameEmployee = employeeId ? employee.id === employeeId : true;

    return isSameDate && isSameEmployee;
  });
}
