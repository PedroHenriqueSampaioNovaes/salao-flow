'use client';

import LoadingSecondary from './loading-secondary';

interface FormButtonProps {
  isSubmitting: boolean;
  children: React.ReactNode;
}

export default function FormButton({
  isSubmitting,
  children,
}: FormButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-accent px-6 py-3.5 text-sm font-bold text-white transition-colors duration-150 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isSubmitting ? <LoadingSecondary /> : children}
    </button>
  );
}
