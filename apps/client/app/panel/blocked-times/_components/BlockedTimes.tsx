'use client';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

import deleteBlockedTimesAction from '@/app/actions/delete-blocked-times';

import PageHeader from '@/app/panel/_components/PageHeader';
import BlockedTimeRow from './BlockedTimeRow';
import CreateBlockedTimeDialog from './CreateBlockedTimeDialog';

const columns = ['Nome', 'Início', 'Fim', 'Duração'];

export default function BlockedTimes() {
  const { barbershop, blockedTimes, setBlockedTimes } = usePanelContext();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este bloqueio?')) {
      return;
    }

    const { ok, error } = await deleteBlockedTimesAction(id);

    if (!ok) {
      showErrorToast(error);
      return;
    }

    showSuccessToast('Bloqueio de horário excluído com sucesso!');

    setBlockedTimes((prev) =>
      prev.filter((blockedTime) => blockedTime.id !== id),
    );
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
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
