'use client';

import Link from 'next/link';

import deleteClientAction from '@/app/actions/delete-client';

import { useClientsContext } from '@/src/common/contexts/clients-context';

export default function Clients() {
  const { clients, setClients } = useClientsContext();

  return (
    <>
      <div className="mb-10 flex items-center gap-10">
        <h1>Clientes:</h1>
        <Link className="cursor-pointer" href="/panel/clients/new">
          Adicionar
        </Link>
      </div>

      {clients.map((client) => (
        <div key={client.id} className="flex items-center gap-5">
          <p>{client.name}</p>
          <p>{client.phone}</p>
          <p>{client.email}</p>
          <Link
            className="cursor-pointer"
            href={`/panel/clients/${client.id}/edit`}
          >
            Editar
          </Link>
          <button
            className="cursor-pointer"
            onClick={async () => {
              await deleteClientAction(client.id);
              setClients((prev) => prev.filter((cli) => cli.id !== client.id));
            }}
          >
            DELETAR
          </button>
        </div>
      ))}
    </>
  );
}
