'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

import { IBarbershop } from '../interfaces/barbershop';
import { IEmployee, IExpedient } from '../interfaces/employee';
import { IAppointment } from '../interfaces/appointment';
import { IService } from '../interfaces/service';
import { IBlockedTime } from '../interfaces/employee-schedule';

interface IPanelContext {
  barbershop: IBarbershop;
  employees: IEmployee[];
  appointments: IAppointment[];
  services: IService[];
  expedients: IExpedient[];
  blockedTimes: IBlockedTime[];
  setBarbershop: Dispatch<SetStateAction<IBarbershop>>;
  setEmployees: Dispatch<SetStateAction<IEmployee[]>>;
  setAppointments: Dispatch<SetStateAction<IAppointment[]>>;
  setServices: Dispatch<SetStateAction<IService[]>>;
  setExpedients: Dispatch<SetStateAction<IExpedient[]>>;
  setBlockedTimes: Dispatch<SetStateAction<IBlockedTime[]>>;
}

const PanelContext = createContext<IPanelContext>({
  barbershop: {} as IBarbershop,
  employees: [],
  appointments: [],
  services: [],
  expedients: [],
  blockedTimes: [],
  setBarbershop: () => {},
  setEmployees: () => {},
  setAppointments: () => {},
  setServices: () => {},
  setExpedients: () => {},
  setBlockedTimes: () => {},
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
  servicesData: IService[];
  expedientsData: IExpedient[];
  blockedTimesData: IBlockedTime[];
}

export function PanelProvider({
  children,
  barbershopData,
  employeesData,
  servicesData,
  expedientsData,
  blockedTimesData,
}: IPanelProviderProps) {
  const [barbershop, setBarbershop] = useState(barbershopData);
  const [employees, setEmployees] = useState(employeesData);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [services, setServices] = useState(servicesData);
  const [expedients, setExpedients] = useState(expedientsData);
  const [blockedTimes, setBlockedTimes] = useState(blockedTimesData);

  return (
    <PanelContext.Provider
      value={{
        barbershop,
        employees,
        appointments,
        services,
        expedients,
        blockedTimes,
        setBarbershop,
        setEmployees,
        setAppointments,
        setServices,
        setExpedients,
        setBlockedTimes,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
}
