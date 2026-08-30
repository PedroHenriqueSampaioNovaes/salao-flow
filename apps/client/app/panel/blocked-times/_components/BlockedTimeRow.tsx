'use client';

import { Clock } from 'lucide-react';

import { TableCell, TableRow } from '@/src/components/ui/table';
import { TrashButton } from '@/src/components/ui/trash-button';

import { IBlockedTime } from '@/src/common/interfaces/employee-schedule';

import { formatBlockedTimeRow } from '../_utils/formatBlockedTimeRow';
import EditBlockedTimeDialog from './EditBlockedTimeDialog';

interface IBlockedTimeRowProps {
  blockedTime: IBlockedTime;
  timezone: string;
  onDelete: (id: string) => void;
}

export default function BlockedTimeRow({
  blockedTime,
  timezone,
  onDelete,
}: IBlockedTimeRowProps) {
  const { startLabel, endLabel, durationLabel } = formatBlockedTimeRow(
    blockedTime,
    timezone,
  );

  return (
    <TableRow>
      <TableCell>
        <span className="font-bold text-black">{blockedTime.name}</span>
      </TableCell>
      <TableCell className="text-primary whitespace-nowrap">{startLabel}</TableCell>
      <TableCell className="text-primary whitespace-nowrap">{endLabel}</TableCell>
      <TableCell>
        <span className="bg-foreground text-brand-accent text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 whitespace-nowrap">
          <Clock className="size-4" />
          {durationLabel}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <EditBlockedTimeDialog blockedTimeId={blockedTime.id} />

          <TrashButton
            onClick={() => onDelete(blockedTime.id)}
            aria-label="Excluir horário bloqueado"
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
