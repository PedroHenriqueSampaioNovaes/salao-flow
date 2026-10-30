'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { IBarbershop } from '../interfaces/barbershop';
import { IEmployee, IExpedient } from '../interfaces/employee';
import { IAppointment, IAppointmentsByDate } from '../interfaces/appointment';
import { IService } from '../interfaces/service';
import { IBlockedTime } from '../interfaces/employee-schedule';

import { connectToSocket, disconnectSocket } from '../lib/socket';

import { DASHBOARD_METRICS_QUERY_KEY } from '@/app/panel/dashboard/_components/MetricCards';

interface IPanelContext {
  barbershop: IBarbershop;
  employees: IEmployee[];
  appointments: IAppointmentsByDate;
  services: IService[];
  expedients: IExpedient[];
  blockedTimes: IBlockedTime[];
  setBarbershop: Dispatch<SetStateAction<IBarbershop>>;
  setEmployees: Dispatch<SetStateAction<IEmployee[]>>;
  setAppointments: Dispatch<SetStateAction<IAppointmentsByDate>>;
  setServices: Dispatch<SetStateAction<IService[]>>;
  setExpedients: Dispatch<SetStateAction<IExpedient[]>>;
  setBlockedTimes: Dispatch<SetStateAction<IBlockedTime[]>>;
}

const PanelContext = createContext<IPanelContext>({
  barbershop: {} as IBarbershop,
  employees: [],
  appointments: {},
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
  token: string;
  apiUrl: string;
}

export function PanelProvider({
  children,
  barbershopData,
  employeesData,
  servicesData,
  expedientsData,
  blockedTimesData,
  token,
  apiUrl,
}: IPanelProviderProps) {
  const [barbershop, setBarbershop] = useState(barbershopData);
  const [employees, setEmployees] = useState(employeesData);
  const [appointments, setAppointments] = useState<IAppointmentsByDate>({});
  const [services, setServices] = useState(servicesData);
  const [expedients, setExpedients] = useState(expedientsData);
  const [blockedTimes, setBlockedTimes] = useState(blockedTimesData);
  const queryClient = useQueryClient();

  const socketConnected = useRef(false);
  const handleNewAppointment = useCallback(
    (appointment: IAppointment) => {
      setAppointments((prev) => {
        const appointmentDate = new Date(appointment.date).toLocaleDateString(
          'en-CA',
          { timeZone: 'UTC' },
        );
        const appointmentsOfTheDay = prev[appointmentDate] || [];
        const ordenedAppointments = [...appointmentsOfTheDay, appointment].sort(
          (a, b) => a.date.localeCompare(b.date),
        );

        return {
          ...prev,
          [appointmentDate]: ordenedAppointments,
        };
      });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_METRICS_QUERY_KEY });
    },
    [queryClient],
  );

  useEffect(() => {
    if (!token || socketConnected.current) return;

    const socket = connectToSocket(token, apiUrl);
    socket.on('new-appointment', handleNewAppointment);
    socketConnected.current = true;

    return () => {
      socket.off('new-appointment', handleNewAppointment);
      disconnectSocket(token, apiUrl);
      socketConnected.current = false;
    };
  }, [token, apiUrl, handleNewAppointment]);

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
