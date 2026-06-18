export interface IEmployeeSchedule {
  id: string;
  name: string;
  barbershop: string;
  isDefault: boolean;
  employeeScheduleWeekdays: ScheduleWeekday[];
}

interface ScheduleWeekday {
  id: string;
  weekday: number;
  isWorkingDay: boolean;
  start: string | null;
  startLunch: string | null;
  endLunch: string | null;
  end: string | null;
}
