'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';

import { Dialog, DialogTrigger } from '@/src/components/ui/dialog';
import Loading from '@/src/components/ui/loading';
import PanelActionButton from '@/app/panel/_components/PanelActionButton';

const CreateServiceDialogContent = dynamic(
  () => import('./CreateServiceDialogContent'),
);

export default function CreateServiceDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <PanelActionButton>
          <span>Novo serviço</span>
        </PanelActionButton>
      </DialogTrigger>

      {open && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <Loading />
            </div>
          }
        >
          <CreateServiceDialogContent closeDialog={() => setOpen(false)} />
        </Suspense>
      )}
    </Dialog>
  );
}
