import * as React from 'react';

import { cn } from '@/src/lib/utils';

export const inputStyles =
  'w-full min-w-0 h-10.5 rounded-lg border border-border/20 bg-transparent px-3 py-2 text-base outline-none transition-colors placeholder:text-secondary focus:border focus:border-accent focus:ring-2 focus:ring-accent/25 aria-invalid:focus:ring-error/25 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-error md:text-sm';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        inputStyles,
        'file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
