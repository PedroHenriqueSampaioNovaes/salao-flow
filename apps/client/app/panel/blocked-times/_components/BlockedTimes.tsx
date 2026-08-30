'use client';

import { useState } from 'react';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

import deleteBlockedTimesAction from '@/app/actions/delete-blocked-times';

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
import BlockedTimeRow from './BlockedTimeRow';
import CreateBlockedTimeDialog from './CreateBlockedTimeDialog';

const columns = ['Nome', 'Início', 'Fim', 'Duração'];

export default function BlockedTimes() {
  const { barbershop, blockedTimes, setBlockedTimes } = usePanelContext();
  const [blockedTimeToDelete, setBlockedTimeToDelete] = useState<string | null>(
    null,
  );

  const handleDelete = async () => {
    if (!blockedTimeToDelete) return;

    const { ok, error } = await deleteBlockedTimesAction(blockedTimeToDelete);

    if (!ok) {
      showErrorToast(error);
      setBlockedTimeToDelete(null);
      return;
    }

    showSuccessToast('Bloqueio de horário excluído com sucesso!');

    setBlockedTimes((prev) =>
      prev.filter((blockedTime) => blockedTime.id !== blockedTimeToDelete),
    );
    setBlockedTimeToDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Horários Bloqueados"
        description="Gerencie os períodos em que a agenda de seus funcionários ficará indisponível."
        action={<CreateBlockedTimeDialog />}
      />

      <div className="bg-white rounded-2xl shadow shadow-neutral/20 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral/20">
              {columns.map((column, index) => (
                <th
                  key={column}
                  className={`text-left text-xs font-bold uppercase tracking-wider text-secondary px-5 py-3 ${
                    index === 0 ? 'min-w-45' : ''
                  }`}
                >
                  {column}
                </th>
              ))}
              <th className="text-right text-xs font-bold uppercase tracking-wider text-secondary px-5 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {blockedTimes.map((blockedTime) => (
              <BlockedTimeRow
                key={blockedTime.id}
                blockedTime={blockedTime}
                timezone={barbershop.timezone}
                onDelete={(id) => setBlockedTimeToDelete(id)}
              />
            ))}
            {blockedTimes.length === 0 && (
              <tr className="border-b border-neutral/20 last:border-0">
                <td colSpan={columns.length + 1}>
                  <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                    <p className="font-bold text-base">
                      Nenhum horário bloqueado
                    </p>
                    <p className="max-w-sm text-sm text-secondary">
                      A agenda de seus funcionários está totalmente disponível.
                      Adicione um bloqueio para impedir agendamentos em datas e
                      horas específicas.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog
        open={!!blockedTimeToDelete}
        onOpenChange={(open) => !open && setBlockedTimeToDelete(null)}
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
            <AlertDialogAction onClick={handleDelete}>
              Excluir bloqueio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
