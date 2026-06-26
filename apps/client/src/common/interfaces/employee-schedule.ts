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

export interface IBlockedTime {
  id: string;
  name: string;
  initialDate: string;
  finalDate: string;
  barbershopId: number;
  employees: {
    id: number;
    name: string;
  }[];
}

export interface ICreateBlockedTime {
  name: string;
  initialDate: string;
  finalDate: string;
  initialTime: string;
  finalTime: string;
  employeeIds: number[];
}
