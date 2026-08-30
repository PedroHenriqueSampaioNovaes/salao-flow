'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';

import { Dialog, DialogTrigger } from '@/src/components/ui/dialog';
import Loading from '@/src/components/ui/loading';
import { EditButton } from '@/src/components/ui/edit-button';

const EditBlockedTimeDialogContent = dynamic(
  () => import('./EditBlockedTimeDialogContent'),
);

interface IEditBlockedTimeDialogProps {
  blockedTimeId: string;
}

export default function EditBlockedTimeDialog({
  blockedTimeId,
}: IEditBlockedTimeDialogProps) {
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
          <EditBlockedTimeDialogContent
            blockedTimeId={blockedTimeId}
            closeDialog={() => setOpen(false)}
          />
        </Suspense>
      )}
    </Dialog>
  );
}
