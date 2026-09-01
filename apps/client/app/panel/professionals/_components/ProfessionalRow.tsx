'use client';

import Image from 'next/image';

import { TableCell, TableRow } from '@/src/components/ui/table';
import { TrashButton } from '@/src/components/ui/trash-button';

import { IEmployee } from '@/src/common/interfaces/employee';

import EditProfessionalDialog from './EditProfessionalDialog';

interface IProfessionalRowProps {
  employee: IEmployee;
  onDelete: (id: number) => void;
}

export default function ProfessionalRow({
  employee,
  onDelete,
}: IProfessionalRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Image
            className="size-10 rounded-full object-cover"
            width={40}
            height={40}
            src={employee.image}
            alt={employee.name}
          />
          <span className="font-bold text-black">{employee.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <EditProfessionalDialog employeeId={employee.id} />

          <TrashButton
            onClick={() => onDelete(employee.id)}
            aria-label="Excluir profissional"
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
