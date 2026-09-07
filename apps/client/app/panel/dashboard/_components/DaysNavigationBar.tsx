'use client';

import { Dispatch, SetStateAction } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useDaysNavigation } from '../_hooks/useDaysNavigation';

import { cn } from '@/src/lib/utils';

interface IDaysNavigationBarProps {
  selectedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
}

export default function DaysNavigationBar({
  selectedDate,
  setSelectedDate,
}: IDaysNavigationBarProps) {
  const { days, moveDay, selectDay } = useDaysNavigation({
    selectedDate,
    setSelectedDate,
  });

  return (
    <div className="p-4 lg:px-6 flex items-center justify-between">
      <button
        onClick={() => moveDay(-1)}
        className="size-8 sm:size-9 rounded-full border border-border/20 flex items-center justify-center text-gray-600 hover:bg-foreground focus-visible:bg-foreground transition-colors cursor-pointer shrink-0"
      >
        <ChevronLeft className="size-4" />
      </button>

      <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-1">
        {days.map(({ date, dayName, dayNum, isSelected, isMatchDate }) => (
          <button
            key={date.getTime()}
            onClick={() => selectDay(date)}
            className={cn(
              'flex flex-col items-center cursor-pointer py-2 relative hover:bg-foreground focus:bg-foreground rounded-md w-7.5 sm:w-10',
              isSelected &&
                'bg-foreground border border-white shadow-[0_0_0_1px_var(--color-brand-accent)]',
            )}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
              {dayName}
            </span>
            <p className="font-bold max-lg:text-sm">{dayNum}</p>
            {isMatchDate && (
              <div className="size-1 rounded-full bg-accent absolute bottom-0.5" />
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() => moveDay(1)}
        className="size-8 sm:size-9 rounded-full border border-border/20 flex items-center justify-center text-gray-600 hover:bg-foreground focus-visible:bg-foreground transition-colors cursor-pointer shrink-0"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
