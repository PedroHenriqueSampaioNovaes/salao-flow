import getEmployeeSchedulesAction from '@/app/actions/get-employee-schedules';

import NewForm from './_components/NewForm';

export default async function NewPage() {
  const { data: employeeSchedules } = await getEmployeeSchedulesAction();

  if (!employeeSchedules) {
    return <p>É necessário ter pelo menos um expediente padrão</p>;
  }

  return <NewForm employeeSchedules={employeeSchedules} />;
}
