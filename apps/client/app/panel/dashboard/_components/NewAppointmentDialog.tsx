'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';

import { CalendarPlus2 } from 'lucide-react';

import { Dialog, DialogTrigger } from '@/src/components/ui/dialog';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { showErrorToast } from '@/src/common/lib/toast';

const NewAppointmentDialogContent = dynamic(
  () => import('./NewAppointmentDialogContent'),
);

export default function NewAppointmentDialog() {
  const { employees } = usePanelContext();
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (employees.length === 0) {
          showErrorToast(
            'Nenhum funcionário disponível para agendamento! Cadastre um para continuar.',
          );
          return;
        }
        setOpen(!open);
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-full bg-brand-accent hover:bg-accent text-white font-semibold py-2.5 px-6 rounded-md flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <CalendarPlus2 className="size-4" />
          <span>Novo Agendamento</span>
        </button>
      </DialogTrigger>

      {open && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-brand-accent" />
            </div>
          }
        >
          <NewAppointmentDialogContent closeDialog={() => setOpen(false)} />
        </Suspense>
      )}
    </Dialog>
  );
}
