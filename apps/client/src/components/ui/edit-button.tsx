import { Pencil } from 'lucide-react';

import { cn } from '@/src/lib/utils';

import { Button } from './button';

interface IEditButtonProps extends React.ComponentProps<'button'> {
  className?: string;
}

function EditButton({ className, ...props }: IEditButtonProps) {
  return (
    <Button
      aria-label="Editar"
      title="Editar"
      className={cn(
        'size-8 p-0 rounded-full text-primary hover:bg-primary/10 shrink-0',
        className,
      )}
      {...props}
    >
      <Pencil className="size-4" />
    </Button>
  );
}

export { EditButton };
