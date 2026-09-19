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
    <button type="submit" disabled={isSubmitting} className="button-form">
      {isSubmitting ? <LoadingSecondary /> : children}
    </button>
  );
}
