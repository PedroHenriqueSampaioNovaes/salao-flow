'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

import { IBarbershop } from '@/src/common/interfaces/barbershop';
import { IEmployee } from '../interfaces/employee';
import { IAppointment } from '../interfaces/appointment';

interface IPanelContext {
  barbershop: IBarbershop | null;
  employees: IEmployee[];
  appointments: IAppointment[];
  setBarbershop: Dispatch<SetStateAction<IBarbershop | null>>;
  setEmployees: Dispatch<SetStateAction<IEmployee[]>>;
  setAppointments: Dispatch<SetStateAction<IAppointment[]>>;
}

const PanelContext = createContext<IPanelContext>({
  barbershop: null,
  employees: [],
  appointments: [],
  setBarbershop: () => {},
  setEmployees: () => {},
  setAppointments: () => {},
});

export function usePanelContext() {
  const context = useContext(PanelContext);

  if (!context) {
    throw new Error(
      'usePanelContext deve ser usado dentro de um PanelProvider',
    );
  }

  return context;
}

interface IPanelProviderProps {
  children: React.ReactNode;
  barbershopData: IBarbershop | null;
  employeesData: IEmployee[];
  appointmentsData: IAppointment[];
}

export function PanelProvider({
  children,
  barbershopData,
  employeesData,
  appointmentsData,
}: IPanelProviderProps) {
  const [barbershop, setBarbershop] = useState(barbershopData);
  const [employees, setEmployees] = useState(employeesData);
  const [appointments, setAppointments] = useState(appointmentsData);

  return (
    <PanelContext.Provider
      value={{
        barbershop,
        employees,
        appointments,
        setBarbershop,
        setEmployees,
        setAppointments,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
}
