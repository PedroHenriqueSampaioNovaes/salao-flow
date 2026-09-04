'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Input } from '@/src/components/ui/input';
import { cn } from '@/src/lib/utils';

function PasswordInputToggle({
  className,
  ...props
}: Omit<React.ComponentProps<'input'>, 'type'>) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? 'text' : 'password'}
        className={cn('pr-10', className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md flex items-center p-2 text-secondary hover:bg-gray-50 focus:text-black focus-visible:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-pointer"
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visible}
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

export { PasswordInputToggle };
