import { ReactNode } from 'react';

interface IPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  action,
}: IPageHeaderProps) {
  return (
    <div className="mb-6 flex max-sm:flex-col items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-sm text-secondary mt-1 max-w-100">{description}</p>
        )}
      </div>

      {action}
    </div>
  );
}
