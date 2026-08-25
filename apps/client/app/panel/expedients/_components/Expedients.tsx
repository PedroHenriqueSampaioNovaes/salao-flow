'use client';

import Link from 'next/link';

import deleteExpedientAction from '@/app/actions/delete-expedient';

import { usePanelContext } from '@/src/common/contexts/panel-context';

export default function Expedients() {
  const { expedients, setExpedients } = usePanelContext();

  return (
    <div>
      <div className="mb-10 flex items-center gap-10">
        <h1>Expedientes:</h1>
        <Link className="cursor-pointer" href="/panel/expedients/new">
          Adicionar
        </Link>
      </div>

      {expedients.map((expedient) => (
        <div key={expedient.id} className="flex items-center gap-5">
          <p>{expedient.name}</p>
          <Link
            className="cursor-pointer"
            href={`/panel/expedients/${expedient.id}/edit`}
          >
            Editar
          </Link>
          <button
            className="cursor-pointer"
            onClick={async () => {
              await deleteExpedientAction(expedient.id);
              setExpedients((prev) =>
                prev.filter((emp) => emp.id !== expedient.id),
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
