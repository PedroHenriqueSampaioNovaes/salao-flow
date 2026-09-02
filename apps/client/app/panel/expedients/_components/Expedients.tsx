'use client';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import PageHeader from '../../_components/PageHeader';

import CreateExpedientDialog from './CreateExpedientDialog';
import ExpedientRow from './ExpedientRow';

import { useDeleteExpedient } from '../_hooks/useDeleteExpedient';

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

const columns = ['Expediente'];

export default function Expedients() {
  const { expedients } = usePanelContext();
  const { expedientToDelete, requestDelete, cancelDelete, confirmDelete } =
    useDeleteExpedient();

  return (
    <div>
      <PageHeader
        title="Expedientes"
        description="Gerencie os horários de funcionamento da sua equipe."
        action={<CreateExpedientDialog />}
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
            {expedients.map((expedient) => (
              <ExpedientRow
                key={expedient.id}
                expedient={expedient}
                onDelete={requestDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!expedientToDelete}
        onOpenChange={(open) => !open && cancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir expediente</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este expediente? Essa ação não pode
            ser desfeita.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Excluir expediente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
