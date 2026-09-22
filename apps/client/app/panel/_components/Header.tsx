'use client';

import { LogOutIcon, Menu, Settings } from 'lucide-react';
import Link from 'next/link';

import { IBarbershop } from '@/src/common/interfaces/barbershop';

import { useSidebarContext } from '@/src/common/contexts/sidebar-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { Button } from '@/src/components/ui/button';
import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import logoutAction from '@/app/actions/logout';

interface IHeaderProps {
  barbershop: IBarbershop;
}

export default function Header({ barbershop }: IHeaderProps) {
  const { toggleSidebar } = useSidebarContext();

  return (
    <header className="bg-white border-b border-neutral/20 h-(--header) flex items-center justify-between lg:justify-end px-4 lg:px-6 fixed left-0 top-0 z-50 w-full">
      <button
        onClick={() => toggleSidebar()}
        className="flex lg:hidden items-center justify-center text-black cursor-pointer p-2 shadow-[0_0_3px_var(--neutral)] shadow-neutral/20 rounded-md"
      >
        <Menu className="size-6" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full px-0">
            <Avatar size="lg">
              <AvatarImage
                src={barbershop.image}
                alt={`Logo do empreendimento ${barbershop.name}`}
              />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                href="/panel/settings"
                className="flex items-center gap-1.5"
              >
                <Settings />
                Configurações
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-neutral/20" />
          <DropdownMenuItem variant="destructive" onSelect={logoutAction}>
            <LogOutIcon />
            Sair da conta
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
