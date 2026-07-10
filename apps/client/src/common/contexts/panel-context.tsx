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
import { IService } from '../interfaces/service';

interface IPanelContext {
  barbershop: IBarbershop;
  employees: IEmployee[];
  appointments: IAppointment[];
  services: IService[];
  setBarbershop: Dispatch<SetStateAction<IBarbershop>>;
  setEmployees: Dispatch<SetStateAction<IEmployee[]>>;
  setAppointments: Dispatch<SetStateAction<IAppointment[]>>;
  setServices: Dispatch<SetStateAction<IService[]>>;
}

const PanelContext = createContext<IPanelContext>({
  barbershop: {} as IBarbershop,
  employees: [],
  appointments: [],
  services: [],
  setBarbershop: () => {},
  setEmployees: () => {},
  setAppointments: () => {},
  setServices: () => {},
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
  barbershopData: IBarbershop;
  employeesData: IEmployee[];
  appointmentsData: IAppointment[];
  servicesData: IService[];
}

export function PanelProvider({
  children,
  barbershopData,
  employeesData,
  appointmentsData,
  servicesData,
}: IPanelProviderProps) {
  const [barbershop, setBarbershop] = useState(barbershopData);
  const [employees, setEmployees] = useState(employeesData);
  const [appointments, setAppointments] = useState(appointmentsData);
  const [services, setServices] = useState(servicesData);

  return (
    <PanelContext.Provider
      value={{
        barbershop,
        employees,
        appointments,
        services,
        setBarbershop,
        setEmployees,
        setAppointments,
        setServices,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
}
