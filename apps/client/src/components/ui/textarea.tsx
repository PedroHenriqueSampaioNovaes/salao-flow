import * as React from 'react';

import { cn } from '@/src/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-16 w-full rounded-lg border border-border/20 bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-secondary focus:border-accent focus:ring-2 focus:ring-accent/25 aria-invalid:focus:ring-error/25 disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
