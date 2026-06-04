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

type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface EmployeeScheduleWeekday {
  weekday: Weekday;
  isWorkingDay: boolean;
  start: string | null;
  startLunch: string | null;
  endLunch: string | null;
  end: string | null;
}

export interface EmployeeScheduleWithWeekdays extends EmployeeSchedule {
  employeeScheduleWeekdays: EmployeeScheduleWeekday[];
}
