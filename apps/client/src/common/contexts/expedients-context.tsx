'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

import { IExpedient } from '@/src/common/interfaces/employee';

interface IExpedientsContext {
  expedients: IExpedient[];
  setExpedients: Dispatch<SetStateAction<IExpedient[]>>;
}

const ExpedientsContext = createContext<IExpedientsContext>({
  expedients: [],
  setExpedients: () => {},
});

export function useExpedientsContext() {
  const context = useContext(ExpedientsContext);

  if (!context) {
    throw new Error(
      'useExpedientsContext deve ser usado dentro de um ExpedientsProvider',
    );
  }

  return context;
}

interface IExpedientsProviderProps {
  children: React.ReactNode;
  expedientsData: IExpedient[];
}

export function ExpedientsProvider({
  children,
  expedientsData,
}: IExpedientsProviderProps) {
  const [expedients, setExpedients] = useState(expedientsData);

  return (
    <ExpedientsContext.Provider value={{ expedients, setExpedients }}>
      {children}
    </ExpedientsContext.Provider>
  );
}
