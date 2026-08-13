'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

interface ISelectedDateContext {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
}

const SelectedDateContext = createContext<ISelectedDateContext>({
  date: new Date(),
  setDate: () => {},
});

export function useSelectedDateContext() {
  const context = useContext(SelectedDateContext);

  if (!context) {
    throw new Error(
      'useSelectedDateContext deve ser usado dentro de um SelectedDateProvider',
    );
  }

  return context;
}

interface ISelectedDateProviderProps {
  children: React.ReactNode;
  initialDate: Date;
}

export function SelectedDateProvider({
  children,
  initialDate,
}: ISelectedDateProviderProps) {
  const [date, setDate] = useState(initialDate);

  return (
    <SelectedDateContext.Provider value={{ date, setDate }}>
      {children}
    </SelectedDateContext.Provider>
  );
}
