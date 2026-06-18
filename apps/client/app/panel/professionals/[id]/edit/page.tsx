import EditForm from './_components/EditForm';

import getEmployeeSchedulesAction from '@/app/actions/get-employee-schedules';

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: professionalId } = await params;

  const { data: employeeSchedules } = await getEmployeeSchedulesAction();

  if (!employeeSchedules) {
    return <h1>É necessário ter pelo menos um expediente padrão</h1>;
  }

  return (
    <EditForm
      employeeId={Number(professionalId)}
      employeeSchedules={employeeSchedules}
    />
  );
}
