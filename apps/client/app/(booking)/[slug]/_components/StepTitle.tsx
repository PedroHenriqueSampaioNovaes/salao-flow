'use client';

import { LucideIcon } from 'lucide-react';

interface IStepTitleProps {
  title: string;
  icon: LucideIcon;
}

export default function StepTitle({ title, icon: Icon }: IStepTitleProps) {
  return (
    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <Icon className="size-5 text-white shrink-0" />
      {title}
    </h2>
  );
}
