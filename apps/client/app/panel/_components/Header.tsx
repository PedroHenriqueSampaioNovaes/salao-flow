'use client';

import Image from 'next/image';
import { Menu } from 'lucide-react';

import { IBarbershop } from '@/src/common/interfaces/barbershop';

import { useSidebarContext } from '@/src/common/contexts/sidebar-context';

interface IHeaderProps {
  barbershop: IBarbershop;
}

export default function Header({ barbershop }: IHeaderProps) {
  const { toggleSidebar } = useSidebarContext();

  return (
    <header className="bg-white border-b border-neutral/20 h-(--header) flex items-center justify-between lg:justify-end px-4 lg:px-6 fixed left-0 top-0 lg:z-50 w-full">
      <button
        onClick={() => toggleSidebar()}
        className="flex lg:hidden items-center justify-center text-black cursor-pointer p-2 shadow-[0_0_3px_var(--neutral)] shadow-neutral/20 rounded-md"
      >
        <Menu className="size-6" />
      </button>

      <Image
        src={barbershop.image}
        alt={`Logo do empreendimento ${barbershop.name}`}
        width={90}
        height={90}
        className="size-9 rounded-full flex items-center justify-center select-none"
      />
    </header>
  );
}
