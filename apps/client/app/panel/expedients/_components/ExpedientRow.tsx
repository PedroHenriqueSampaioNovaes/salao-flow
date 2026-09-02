'use client';

import { TableCell, TableRow } from '@/src/components/ui/table';
import { TrashButton } from '@/src/components/ui/trash-button';

import { IExpedient } from '@/src/common/interfaces/employee';

import EditExpedientDialog from './EditExpedientDialog';

interface IExpedientRowProps {
  expedient: IExpedient;
  onDelete: (id: string) => void;
}

export default function ExpedientRow({
  expedient,
  onDelete,
}: IExpedientRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-bold text-black">{expedient.name}</span>
          {expedient.isDefault && (
            <span className="bg-foreground text-brand-accent text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center whitespace-nowrap">
              Padrão
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <EditExpedientDialog expedientId={expedient.id} />

          <TrashButton
            onClick={() => onDelete(expedient.id)}
            aria-label="Excluir expediente"
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
