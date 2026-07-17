'use client';

import Link from 'next/link';

import { useBlockedTimesContext } from '@/src/common/contexts/blocked-times-context';

import deleteBlockedTimesAction from '@/app/actions/delete-blocked-times';

export default function BlockedTimes() {
  const { blockedTimes, setBlockedTimes } = useBlockedTimesContext();

  return (
    <div>
      <div className="mb-10 flex items-center gap-10">
        <h1>Horários bloqueados:</h1>
        <Link className="cursor-pointer" href="/panel/blocked-times/new">
          Adicionar
        </Link>
      </div>

      {blockedTimes.map((blockedTime) => (
        <div key={blockedTime.id} className="flex items-center gap-5">
          <p>{blockedTime.name}</p>
          <p>{blockedTime.initialDate}</p>
          <p>{blockedTime.finalDate}</p>
          <Link
            className="cursor-pointer"
            href={`/panel/blocked-times/${blockedTime.id}/edit`}
          >
            Editar
          </Link>
          <button
            className="cursor-pointer"
            onClick={async () => {
              await deleteBlockedTimesAction(blockedTime.id);
              setBlockedTimes((prev) =>
                prev.filter((blo) => blo.id !== blockedTime.id),
              );
            }}
          >
            DELETAR
          </button>
        </div>
      ))}
    </div>
  );
}
