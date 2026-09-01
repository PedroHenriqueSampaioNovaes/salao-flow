import { cn } from '@/src/lib/utils';

import { Button } from './button';

interface IWhatsAppButtonProps {
  onClick: () => void;
  'aria-label': string;
  className?: string;
}

function WhatsAppButton({
  onClick,
  'aria-label': ariaLabel,
  className,
}: IWhatsAppButtonProps) {
  return (
    <Button
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'size-8 p-0 rounded-full text-emerald-600 hover:bg-emerald-600/10 shrink-0',
        className,
      )}
    >
      <svg
        className="size-4"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.32 4.94L2 22l5.2-1.36a9.94 9.94 0 0 0 4.84 1.24h.01c5.52 0 10-4.48 10-10s-4.48-9.88-10.01-9.88Zm5.86 14.19c-.25.7-1.45 1.35-2 1.43-.51.08-1.15.11-1.86-.12-.43-.13-.98-.31-1.69-.62-2.97-1.28-4.91-4.28-5.06-4.48-.15-.2-1.22-1.62-1.22-3.09 0-1.47.77-2.19 1.05-2.49.27-.3.6-.37.8-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.25.6.85 2.07.92 2.22.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.36 1.45.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.28.1 1.75.82 2.05.97.3.15.5.22.57.35.08.13.08.72-.17 1.42Z" />
      </svg>
    </Button>
  );
}

export { WhatsAppButton };
