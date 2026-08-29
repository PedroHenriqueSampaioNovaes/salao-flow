import { ComponentProps } from 'react';
import { Plus } from 'lucide-react';

import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';

export default function PanelActionButton({
  className,
  children,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        'bg-brand-accent hover:bg-accent text-white font-bold text-sm px-4 py-2 rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer h-10',
        className,
      )}
      {...props}
    >
      <Plus className="size-4" />
      {children}
    </Button>
  );
}
