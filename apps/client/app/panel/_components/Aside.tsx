'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Scissors,
  Users,
  CalendarX,
  User,
  Settings,
  House,
  ListChecks,
} from 'lucide-react';

import { cn } from '@/src/lib/utils';

import { useSidebarContext } from '@/src/common/contexts/sidebar-context';

const navItems = [
  {
    label: 'Dashboard',
    href: '/panel/dashboard',
    icon: House,
  },
  {
    label: 'Serviços',
    href: '/panel/services',
    icon: Scissors,
  },
  {
    label: 'Profissionais',
    href: '/panel/professionals',
    icon: Users,
  },
  {
    label: 'Expedientes',
    href: '/panel/expedients',
    icon: ListChecks,
  },
  {
    label: 'Bloqueio de Horários',
    href: '/panel/blocked-times',
    icon: CalendarX,
  },
  {
    label: 'Clientes',
    href: '/panel/clients',
    icon: User,
  },
  {
    label: 'Configurações',
    href: '/panel/settings',
    icon: Settings,
  },
];

export default function Aside() {
  const pathname = usePathname();

  const { isOpen, toggleSidebar } = useSidebarContext();

  function handleNavClick(isActive: boolean) {
    if (!isActive && isOpen) {
      toggleSidebar();
    }
  }

  return (
    <aside
      className={cn(
        'h-screen lg:pt-(--header) max-lg:w-full flex transition duration-300 fixed left-0 top-0 z-40 overflow-x-hidden',
        isOpen ? 'bg-[#0E1726]/50 lg:bg-white' : 'max-lg:pointer-events-none',
      )}
    >
      <nav
        className={cn(
          'bg-white w-(--sidebar) overflow-y-auto p-4 max-lg:pt-16 flex flex-col gap-2 border-r border-neutral/20 transition duration-300',
          !isOpen && 'max-lg:-translate-x-full',
        )}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          let itemStyle = 'text-neutral hover:bg-foreground font-medium';
          if (isActive) {
            itemStyle = 'bg-brand-accent text-white font-bold';
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(isActive)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${itemStyle}`}
            >
              <Icon
                className={cn(
                  'size-6 shrink-0',
                  isActive ? 'text-white' : 'text-neutral',
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div
        className={cn('flex-1 lg:hidden', !isOpen && 'hidden')}
        onClick={() => toggleSidebar()}
      ></div>
    </aside>
  );
}
