'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/src/lib/utils';
import { Checkbox } from '@/src/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  id?: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  listClassName?: string;
  optionClassName?: string;
  disabled?: boolean;
  ariaInvalid?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

function MultiSelect({
  id,
  options,
  selected,
  onChange,
  placeholder = 'Selecione...',
  emptyMessage = 'Nenhuma opção encontrada.',
  className,
  listClassName,
  optionClassName,
  disabled = false,
  ariaInvalid,
  ref,
}: MultiSelectProps) {
  const generatedId = React.useId();
  const triggerId = id ?? `${generatedId}-trigger`;
  const listboxId = `${triggerId}-listbox`;
  const [open, setOpen] = React.useState(false);
  const optionRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const selectedLabels = React.useMemo(
    () =>
      options
        .filter((option) => selected.includes(option.value))
        .map((option) => option.label),
    [options, selected],
  );

  const displayValue = selectedLabels.join(', ');

  function handleOptionToggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((selectedValue) => selectedValue !== value));
      return;
    }

    onChange([...selected, value]);
  }

  function focusOption(index: number) {
    optionRefs.current[index]?.focus();
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (
      event.key === 'ArrowDown' ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();
      setOpen(true);
      window.requestAnimationFrame(() => focusOption(0));
    }
  }

  function handleOptionKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
    value: string,
  ) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusOption((index + 1) % options.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusOption((index - 1 + options.length) % options.length);
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      handleOptionToggle(value);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={ref}
          id={triggerId}
          type="button"
          role="combobox"
          aria-controls={listboxId}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-invalid={ariaInvalid}
          disabled={disabled}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            'flex w-full min-w-0 h-10.5 items-center justify-between gap-2 rounded-lg border border-border/20 bg-transparent px-3 py-2 text-left text-sm transition-colors outline-none focus:border-accent focus:ring-2 data-[state=open]:ring-2 focus:ring-accent/20 data-[state=open]:border-accent data-[state=open]:ring-accent/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
        >
          <span
            className={cn(
              'block min-w-0 flex-1 truncate',
              !displayValue && 'text-secondary',
            )}
          >
            {displayValue || placeholder}
          </span>
          <ChevronDownIcon
            className="size-4 shrink-0 text-gray-600 select-none"
            aria-hidden="true"
            data-slot="native-select-icon"
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        id={listboxId}
        role="listbox"
        aria-multiselectable="true"
        align="start"
        className={cn(
          'w-(--radix-popover-trigger-width) gap-2 max-h-60 p-1 overflow-auto bg-white',
          listClassName,
        )}
      >
        {options.length > 0 ? (
          options.map((option, index) => {
            const isSelected = selected.includes(option.value);

            return (
              <label
                key={option.value}
                htmlFor={`${triggerId}-option-${option.value}`}
                role="option"
                aria-selected={isSelected}
                className={cn(
                  'flex w-full cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50',
                  optionClassName,
                )}
              >
                <Checkbox
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  id={`${triggerId}-option-${option.value}`}
                  checked={isSelected}
                  onCheckedChange={() => handleOptionToggle(option.value)}
                  onKeyDown={(event) =>
                    handleOptionKeyDown(event, index, option.value)
                  }
                  disabled={disabled}
                  className="pointer-events-none"
                />
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
              </label>
            );
          })
        ) : (
          <p className="px-2.5 py-2 text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect };
export type { MultiSelectOption, MultiSelectProps };
