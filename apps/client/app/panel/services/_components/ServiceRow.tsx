'use client';

import { TableCell, TableRow } from '@/src/components/ui/table';
import { TrashButton } from '@/src/components/ui/trash-button';

import { IService } from '@/src/common/interfaces/service';

import { formatPrice } from '@/src/common/utils/formatPrice';

import EditServiceDialog from './EditServiceDialog';

interface IServiceRowProps {
  service: IService;
  onDelete: (id: string) => void;
}

export default function ServiceRow({ service, onDelete }: IServiceRowProps) {
  return (
    <TableRow>
      <TableCell>
        <span className="font-bold text-black">{service.name}</span>
      </TableCell>
      <TableCell className="text-primary whitespace-nowrap">
        {formatPrice(service.price)}
      </TableCell>
      <TableCell className="text-primary whitespace-nowrap">
        {service.duration} min
      </TableCell>
      <TableCell>
        {service.status ? (
          <span className="bg-foreground text-brand-accent text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center whitespace-nowrap">
            Ativo
          </span>
        ) : (
          <span className="bg-destructive/10 text-destructive text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center whitespace-nowrap">
            Inativo
          </span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <EditServiceDialog serviceId={service.id} />

          <TrashButton
            onClick={() => onDelete(service.id)}
            aria-label="Excluir serviço"
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
