'use client';

import { Menu } from 'lucide-react';

import { useSidebarContext } from '@/src/common/contexts/sidebar-context';

export default function Header() {
  const { toggleSidebar } = useSidebarContext();

  return (
    <header className="bg-white border-b border-neutral/20 h-(--header) flex items-center justify-between lg:justify-end px-4 lg:px-6 fixed left-0 top-0 z-30 lg:z-50 w-full">
      <button
        onClick={() => toggleSidebar()}
        className="flex lg:hidden items-center gap-2 font-bold text-sm text-[#000000] cursor-pointer"
      >
        <Menu className="size-6 text-[#000000]" />
        <span>Menu</span>
      </button>

      <div className="w-9 h-9 rounded-full bg-[#D9D9D9] flex items-center justify-center font-bold text-sm text-[#000000] select-none">
        PH
      </div>
    </header>
  );
}
