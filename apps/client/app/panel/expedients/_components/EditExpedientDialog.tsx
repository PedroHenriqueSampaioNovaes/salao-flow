'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';

import { Dialog, DialogTrigger } from '@/src/components/ui/dialog';
import Loading from '@/src/components/ui/loading';
import { EditButton } from '@/src/components/ui/edit-button';

const EditExpedientDialogContent = dynamic(
  () => import('./EditExpedientDialogContent'),
);

interface IEditExpedientDialogProps {
  expedientId: string;
}

export default function EditExpedientDialog({
  expedientId,
}: IEditExpedientDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <EditButton />
      </DialogTrigger>

      {open && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <Loading />
            </div>
          }
        >
          <EditExpedientDialogContent
            expedientId={expedientId}
            closeDialog={() => setOpen(false)}
          />
        </Suspense>
      )}
    </Dialog>
  );
}
