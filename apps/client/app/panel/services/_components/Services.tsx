'use client';

import Link from 'next/link';

import deleteServiceAction from '@/app/actions/delete-service';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { formatPrice } from '@/src/common/utils/formatPrice';

export default function Services() {
  const { services, setServices } = usePanelContext();

  return (
    <div>
      <div className="mb-10 flex items-center gap-10">
        <h1>Serviços:</h1>
        <Link className="cursor-pointer" href="/panel/services/new">
          Adicionar
        </Link>
      </div>

      {services.map((service) => (
        <div key={service.id} className="flex items-center gap-5">
          <p>{service.name}</p>
          <p>{formatPrice(service.price)}</p>
          <p>{service.duration} minutos</p>
          <p>Disponível: {service.status === true ? 'Sim' : 'Não'}</p>
          <Link
            className="cursor-pointer"
            href={`/panel/services/${service.id}/edit`}
          >
            Editar
          </Link>
          <button
            className="cursor-pointer"
            onClick={async () => {
              await deleteServiceAction(service.id);
              setServices((prev) =>
                prev.filter((ser) => ser.id !== service.id),
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
