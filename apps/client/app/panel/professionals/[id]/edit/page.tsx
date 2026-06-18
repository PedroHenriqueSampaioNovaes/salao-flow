import EditForm from './_components/EditForm';

import getEmployeeSchedulesAction from '@/app/actions/get-employee-schedules';
import getEmployeeAction from '@/app/actions/get-employee';

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: professionalId } = await params;

  const [employeeSchedules, employee] = await Promise.all([
    getEmployeeSchedulesAction(),
    getEmployeeAction(professionalId),
  ]);

  if (!employeeSchedules.ok) {
    return <h1>É necessário ter pelo menos um expediente padrão</h1>;
  }

  if (!employee.ok) {
    return <h1>Funcionário não encontrado</h1>;
  }

  return (
    <EditForm
      employee={employee.data!}
      employeeSchedules={employeeSchedules.data!}
    />
  );
}
