import * as React from 'react';

import { ChevronDownIcon, LucideIcon } from 'lucide-react';

import { cn } from '@/src/lib/utils';

type NativeSelectProps = Omit<React.ComponentProps<'select'>, 'size'> & {
  size?: 'sm' | 'default';
  Icon?: LucideIcon;
};

function NativeSelect({
  className,
  size = 'default',
  Icon,
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        'group/native-select relative w-full has-[select:disabled]:opacity-50',
        className,
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      {Icon && (
        <Icon
          size={18}
          className="absolute top-1/2 left-2.5 -translate-y-1/2 select-none pointer-events-none"
        />
      )}
      <select
        data-slot="native-select"
        data-size={size}
        className={cn(
          'w-full min-w-0 appearance-none outline-none rounded-md border border-border/20 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 bg-transparent py-2.5 pr-8 pl-2.5 text-sm transition-colors select-none text-black placeholder:text-black disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-[size=sm]:py-0.5',
          !!Icon && 'pl-8.5',
        )}
        {...props}
      />
      <ChevronDownIcon
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-gray-600 select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  );
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<'option'>) {
  return (
    <option
      data-slot="native-select-option"
      className={cn('bg-[Canvas] text-[CanvasText]', className)}
      {...props}
    />
  );
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<'optgroup'>) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn('bg-[Canvas] text-[CanvasText]', className)}
      {...props}
    />
  );
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
