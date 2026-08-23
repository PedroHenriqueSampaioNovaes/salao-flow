'use client';

import { useState, useSyncExternalStore } from 'react';
import { Link as LinkIcon, Copy, Check } from 'lucide-react';

import { usePanelContext } from '@/src/common/contexts/panel-context';

const noopSubscribe = () => () => {};
const getHostSnapshot = () => window.location.host;
const getHostServerSnapshot = () => '';

export default function BookingLink() {
  const { barbershop } = usePanelContext();

  const [copied, setCopied] = useState(false);
  const host = useSyncExternalStore(
    noopSubscribe,
    getHostSnapshot,
    getHostServerSnapshot,
  );

  const bookingLink = `${host}/${barbershop.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${bookingLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow shadow-neutral/20 p-4 flex flex-col">
      <div className="flex items-center gap-2">
        <LinkIcon className="size-5 text-brand-accent shrink-0" />
        <h2 className="font-bold max-sm:text-sm text-black">
          Seu Link de Agendamento
        </h2>
      </div>
      <p className="text-xs text-secondary mt-2 mb-2.5">
        Compartilhe para que clientes agendem sozinhos.
      </p>

      <div className="bg-background rounded-full p-1.5 pl-4 flex items-center justify-between border border-border/20 mt-1">
        <span className="text-xs text-primary font-medium truncate mr-2">
          {bookingLink}
        </span>
        <button
          onClick={handleCopyLink}
          className="bg-white hover:bg-gray-50 font-bold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs border border-gray-200 transition-colors cursor-pointer shrink-0"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-green-600" />
              <span>Copiado</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
