'use client';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import PageHeader from '@/app/panel/_components/PageHeader';
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
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { useDeleteBlockedTime } from '../_hooks/useDeleteBlockedTime';
import BlockedTimeRow from './BlockedTimeRow';
import CreateBlockedTimeDialog from './CreateBlockedTimeDialog';
import EmptyBlockedTimesRow from './EmptyBlockedTimesRow';

const columns = ['Nome', 'Início', 'Fim', 'Duração'];

export default function BlockedTimes() {
  const { barbershop, blockedTimes } = usePanelContext();
  const { blockedTimeToDelete, requestDelete, cancelDelete, confirmDelete } =
    useDeleteBlockedTime();

  return (
    <div>
      <PageHeader
        title="Horários Bloqueados"
        description="Gerencie os períodos em que a agenda de seus funcionários ficará indisponível."
        action={<CreateBlockedTimeDialog />}
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
            {blockedTimes.map((blockedTime) => (
              <BlockedTimeRow
                key={blockedTime.id}
                blockedTime={blockedTime}
                timezone={barbershop.timezone}
                onDelete={requestDelete}
              />
            ))}
            {blockedTimes.length === 0 && <EmptyBlockedTimesRow />}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!blockedTimeToDelete}
        onOpenChange={(open) => !open && cancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir bloqueio de horário</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este bloqueio? Essa ação não pode ser
            desfeita.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Excluir bloqueio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
