import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

import LoadingSecondary from '@/src/components/ui/loading-secondary';
import { Button } from '@/src/components/ui/button';

interface ISettingsCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function SettingsCard({
  title,
  description,
  children,
}: ISettingsCardProps) {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <div className="bg-white rounded-2xl shadow shadow-neutral/20 overflow-hidden">
      <div className="px-6 py-4 border-b border-border/20 flex flex-col gap-0.5">
        <span className="text-lg font-bold">{title}</span>
        <span className="text-sm text-primary">{description}</span>
      </div>
      <div className="flex flex-col p-6">
        {children}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-accent text-white hover:bg-accent px-6 min-w-40 ml-auto mt-6"
        >
          {isSubmitting ? <LoadingSecondary /> : 'Salvar alterações'}
        </Button>
      </div>
    </div>
  );
}
