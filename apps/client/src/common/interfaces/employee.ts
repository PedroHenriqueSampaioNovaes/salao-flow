export interface IEmployee {
  id: number;
  employeeScheduleId: string;
  name: string;
  image: string;
  services: { id: string; name: string; price: number }[];
}

export interface ICreateEmployee {
  name: string;
  image?: string;
  employeeScheduleId: string;
}

export interface IWeekdayExpedient {
  id: string;
  weekday: number;
  isWorkingDay: boolean;
  start?: string | null;
  startLunch?: string | null;
  endLunch?: string | null;
  end?: string | null;
}

export interface IExpedient {
  id: string;
  name: string;
  isDefault: boolean;
  barbershopId: number;
  employeeScheduleWeekdays: IWeekdayExpedient[];
}

export interface IUpdateExpedient {
  name?: string;
  weekdays: Partial<IWeekdayExpedient>[];
}
