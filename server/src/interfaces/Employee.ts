import { UpdateEmployeeSchema } from '@sistema-barbearia/validators';

export interface UpdateEmployeeData extends Partial<
  Omit<UpdateEmployeeSchema, 'id'>
> {
  id: number;
}

export interface EmployeeSchedule {
  name: string;
  isDefault: boolean;
}

export interface EmployeeScheduleWeekday {
  weekday: number;
  is_working_day: boolean;
  start: string | null;
  startLunch: string | null;
  endLunch: string | null;
  end: string | null;
}

export interface EmployeeScheduleWithWeekdays extends EmployeeSchedule {
  employeeScheduleWeekdays: EmployeeScheduleWeekday[];
}
