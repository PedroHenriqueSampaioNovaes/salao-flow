'use client';

import { createContext, useContext } from 'react';

import { IBarbershop } from '@/src/common/interfaces/barbershop';
import { IAppointment } from '@/app/actions/get-appointments';
import { IEmployee } from '@/app/actions/get-employees';

interface IPanelContext {
  barbershop: IBarbershop | null;
  employees: IEmployee[];
  appointments: IAppointment[];
}

const PanelContext = createContext<IPanelContext>({
  barbershop: null,
  employees: [],
  appointments: [],
});

export function usePanelContext() {
  const context = useContext(PanelContext);

  if (!context) {
    throw new Error('usePanelContext deve ser usado dentro de um PanelProvider');
  }

  return context;
}

interface IPanelProviderProps extends IPanelContext {
  children: React.ReactNode;
}

export function PanelProvider({
  children,
  barbershop,
  employees,
  appointments,
}: IPanelProviderProps) {
  return (
    <PanelContext.Provider value={{ barbershop, employees, appointments }}>
      {children}
    </PanelContext.Provider>
  );
}
