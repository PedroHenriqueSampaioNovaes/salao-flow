'use client';

import { LucideIcon, XIcon } from 'lucide-react';

import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog-form';
import { Button } from '@/src/components/ui/button';
import LoadingSecondary from './loading-secondary';

interface FormDialogHeaderProps {
  Icon: LucideIcon;
  title: string;
  description: string;
}

export function FormDialogHeader({
  Icon,
  title,
  description,
}: FormDialogHeaderProps) {
  return (
    <DialogHeader>
      <div className="bg-foreground p-2 rounded-full">
        <Icon className="text-brand-accent" />
      </div>
      <div>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </div>
      <DialogClose asChild className="ml-auto" tabIndex={-1}>
        <button className="rounded-md text-gray-600 hover:bg-gray-100 hover:text-black p-2">
          <XIcon size={20} />
        </button>
      </DialogClose>
    </DialogHeader>
  );
}

interface FormDialogFooterProps {
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
}

export function FormDialogFooter({
  submitLabel = 'Editar',
  cancelLabel = 'Cancelar',
  isSubmitting = false,
}: FormDialogFooterProps) {
  return (
    <DialogFooter>
      <DialogClose asChild>
        <Button
          type="button"
          className="bg-white hover:bg-gray-100 border-border/20 px-5 cursor-pointer"
        >
          {cancelLabel}
        </Button>
      </DialogClose>
      <Button
        type="submit"
        className="min-w-40 bg-brand-accent text-white hover:bg-accent px-5 cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ? <LoadingSecondary /> : submitLabel}
      </Button>
    </DialogFooter>
  );
}
