import { Pencil } from 'lucide-react';

import { cn } from '@/src/lib/utils';

import { Button } from './button';

interface IEditButtonProps extends React.ComponentProps<'button'> {
  className?: string;
}

function EditButton({ className, ...props }: IEditButtonProps) {
  return (
    <Button
      className={cn(
        'bg-white hover:bg-gray-50 font-bold text-xs px-3.5 py-1.5 rounded-full gap-1.5 shadow-xs border-gray-200 shrink-0',
        className,
      )}
      {...props}
    >
      <Pencil className="size-4" />
      <span>Editar</span>
    </Button>
  );
}

export { EditButton };
