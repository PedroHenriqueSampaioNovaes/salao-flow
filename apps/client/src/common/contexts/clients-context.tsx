'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

import { ICustomer } from '@/src/common/interfaces/customer';

interface IClientsContext {
  clients: ICustomer[];
  setClients: Dispatch<SetStateAction<ICustomer[]>>;
}

const ClientsContext = createContext<IClientsContext>({
  clients: [],
  setClients: () => {},
});

export function useClientsContext() {
  const context = useContext(ClientsContext);

  if (!context) {
    throw new Error(
      'useClientsContext deve ser usado dentro de um ClientsProvider',
    );
  }

  return context;
}

interface IClientsProviderProps {
  children: React.ReactNode;
  clientsData: ICustomer[];
}

export function ClientsProvider({
  children,
  clientsData,
}: IClientsProviderProps) {
  const [clients, setClients] = useState(clientsData);

  return (
    <ClientsContext.Provider value={{ clients, setClients }}>
      {children}
    </ClientsContext.Provider>
  );
}
