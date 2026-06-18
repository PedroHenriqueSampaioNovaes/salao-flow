'use client';

import Link from 'next/link';

import deleteEmployeeAction from '@/app/actions/delete-employee';

import { usePanelContext } from '@/src/common/contexts/panel-context';

export default function Professionals() {
  const { employees, setEmployees } = usePanelContext();

  return (
    <>
      <div className="mb-10 flex items-center gap-10">
        <h1>Profissionais:</h1>
        <Link className="cursor-pointer" href="/panel/professionals/new">
          Adicionar
        </Link>
      </div>

      {employees.map((employee) => (
        <div key={employee.id} className="flex items-center gap-5">
          <p>{employee.name}</p>
          <Link
            className="cursor-pointer"
            href={`/panel/professionals/${employee.id}/edit`}
          >
            Editar
          </Link>
          <button
            className="cursor-pointer"
            onClick={async () => {
              await deleteEmployeeAction(employee.id);
              setEmployees((prev) =>
                prev.filter((emp) => emp.id !== employee.id),
              );
            }}
          >
            DELETAR
          </button>
        </div>
      ))}
    </>
  );
}
