'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

import { IBlockedTime } from '@/src/common/interfaces/employee-schedule';

interface IBlockedTimesContext {
  blockedTimes: IBlockedTime[];
  setBlockedTimes: Dispatch<SetStateAction<IBlockedTime[]>>;
}

const BlockedTimesContext = createContext<IBlockedTimesContext>({
  blockedTimes: [],
  setBlockedTimes: () => {},
});

export function useBlockedTimesContext() {
  const context = useContext(BlockedTimesContext);

  if (!context) {
    throw new Error(
      'useBlockedTimesContext deve ser usado dentro de um BlockedTimesProvider',
    );
  }

  return context;
}

interface IBlockedTimesProviderProps {
  children: React.ReactNode;
  blockedTimesData: IBlockedTime[];
}

export function BlockedTimesProvider({
  children,
  blockedTimesData,
}: IBlockedTimesProviderProps) {
  const [blockedTimes, setBlockedTimes] = useState(blockedTimesData);

  return (
    <BlockedTimesContext.Provider value={{ blockedTimes, setBlockedTimes }}>
      {children}
    </BlockedTimesContext.Provider>
  );
}
