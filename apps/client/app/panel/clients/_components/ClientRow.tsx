'use client';

import { TableCell, TableRow } from '@/src/components/ui/table';
import { TrashButton } from '@/src/components/ui/trash-button';
import { WhatsAppButton } from '@/src/components/ui/whatsapp-button';

import { ICustomer } from '@/src/common/interfaces/customer';

import EditClientDialog from './EditClientDialog';

interface IClientRowProps {
  client: ICustomer;
  onDelete: (id: number) => void;
}

export default function ClientRow({ client, onDelete }: IClientRowProps) {
  return (
    <TableRow>
      <TableCell>
        <span className="font-bold text-black">{client.name}</span>
      </TableCell>
      <TableCell className="text-primary whitespace-nowrap">
        {client.phone}
      </TableCell>
      <TableCell className="text-primary whitespace-nowrap">
        {client.visitCount}
      </TableCell>
      <TableCell>
        {client.isBlocked ? (
          <span className="bg-destructive/10 text-destructive text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center whitespace-nowrap">
            Bloqueado
          </span>
        ) : (
          <span className="bg-foreground text-brand-accent text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center whitespace-nowrap">
            Ativo
          </span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <WhatsAppButton
            onClick={() =>
              window.open(
                `https://wa.me/${client.phone.replace(/\D/g, '')}`,
                '_blank',
                'noopener,noreferrer',
              )
            }
            aria-label="Conversar no WhatsApp"
          />

          <EditClientDialog clientId={client.id} />

          <TrashButton
            onClick={() => onDelete(client.id)}
            aria-label="Excluir cliente"
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
