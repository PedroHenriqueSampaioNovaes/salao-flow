import { cn } from '@/src/lib/utils';
import { ReactNode } from 'react';

export default function Wrapper({
  children,
  classNames,
}: {
  children: ReactNode;
  classNames?: string;
}) {
  return (
    <div
      className={cn(
        'p-4 bg-appointment-card-background rounded-lg max-w-118 mx-auto border border-appointment-border',
        classNames,
      )}
    >
      {children}
    </div>
  );
}
