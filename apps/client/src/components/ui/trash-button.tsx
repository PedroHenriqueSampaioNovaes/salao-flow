import { Trash2 } from 'lucide-react';

import { cn } from '@/src/lib/utils';

import { Button } from './button';

interface ITrashButtonProps {
  onClick: () => void;
  'aria-label': string;
  className?: string;
}

function TrashButton({
  onClick,
  'aria-label': ariaLabel,
  className,
}: ITrashButtonProps) {
  return (
    <Button
      onClick={onClick}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={cn(
        'size-8 p-0 rounded-full text-destructive hover:bg-destructive/10 shrink-0',
        className,
      )}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}

export { TrashButton };
