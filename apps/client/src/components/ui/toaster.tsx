'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ToastTheme } from '@/src/common/lib/toast';

interface IToasterProps {
  theme: ToastTheme;
}

export function Toaster({ theme }: IToasterProps) {
  const isDark = theme === 'dark';

  return (
    <ToastContainer
      containerId={theme}
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme={theme}
      toastClassName={
        isDark ? '!bg-appointment-foreground !shadow-lg' : '!bg-white !shadow-lg'
      }
      progressClassName={isDark ? '!bg-cta-accent' : '!bg-brand-accent'}
    />
  );
}
