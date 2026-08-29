'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';

import { Pencil } from 'lucide-react';

import { Dialog, DialogTrigger } from '@/src/components/ui/dialog';
import Loading from '@/src/components/ui/loading';
import { Button } from '@/src/components/ui/button';

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
        <Button className="bg-white hover:bg-gray-50 font-bold text-xs px-3.5 py-1.5 rounded-full gap-1.5 shadow-xs border-gray-200 shrink-0">
          <Pencil className="size-4" />
          <span>Editar</span>
        </Button>
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
