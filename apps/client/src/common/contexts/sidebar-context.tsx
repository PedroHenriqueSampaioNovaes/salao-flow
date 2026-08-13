'use client';

import { createContext, useContext, useState } from 'react';

interface ISidebarContext {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<ISidebarContext>({
  isOpen: false,
  toggleSidebar: () => {},
});

export function useSidebarContext() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(
      'useSidebarContext deve ser usado dentro de um SidebarProvider',
    );
  }

  return context;
}

interface ISidebarProviderProps {
  children: React.ReactNode;
}

export function SidebarProvider({ children }: ISidebarProviderProps) {
  const [isOpen, setOpen] = useState(false);

  function toggleSidebar() {
    setOpen((prev) => !prev);
  }

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}
