'use client';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import PageHeader from '../../_components/PageHeader';

import CreateProfessionalDialog from './CreateProfessionalDialog';
import ProfessionalRow from './ProfessionalRow';
import EmptyProfessionalsRow from './EmptyProfessionalsRow';

import { useDeleteProfessional } from '../_hooks/useDeleteProfessional';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/components/ui/alert-dialog';

const columns = ['Profissional'];

export default function Professionals() {
  const { employees } = usePanelContext();
  const { professionalToDelete, requestDelete, cancelDelete, confirmDelete } =
    useDeleteProfessional();

  return (
    <div>
      <PageHeader
        title="Profissionais"
        description="Gerencie a equipe que atende no seu empreendimento."
        action={<CreateProfessionalDialog />}
      />

      <div className="bg-white rounded-2xl shadow shadow-neutral/20 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={column} wide={index === 0}>
                  {column}
                </TableHead>
              ))}
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <ProfessionalRow
                key={employee.id}
                employee={employee}
                onDelete={requestDelete}
              />
            ))}
            {employees.length === 0 && <EmptyProfessionalsRow />}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!professionalToDelete}
        onOpenChange={(open) => !open && cancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir profissional</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este profissional? Todos os
            agendamentos relacionados a ele serão excluídos. Essa ação não pode
            ser desfeita.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Excluir profissional
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
