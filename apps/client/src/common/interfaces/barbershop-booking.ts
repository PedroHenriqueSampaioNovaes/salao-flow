export interface IServices {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export type IEmployeeScheduleWeekdays =
  | {
      weekday: number;
      isWorkingDay: true;
      start: string;
      startLunch: string;
      endLunch: string;
      end: string;
    }
  | {
      weekday: number;
      isWorkingDay: false;
      start: null;
      startLunch: null;
      endLunch: null;
      end: null;
    };

export interface IEmployeeSchedule {
  employeeScheduleWeekdays: IEmployeeScheduleWeekdays[];
}

export interface IScheduleBlocks {
  initialDate: string;
  finalDate: string;
}

export interface IAppointments {
  date: string;
  totalServiceDuration: number;
}

export interface IEmployeeBookingInfo {
  id: number;
  name: string;
  image: string;
  services: IServices[];
  employeeSchedule: IEmployeeSchedule;
  scheduleBlocks: IScheduleBlocks[];
  appointments: IAppointments[];
}

export interface IBarbershopBookingInfos {
  name: string;
  businessName: string;
  address: string;
  phone: string;
  image: string;
  status: boolean;
  employees: IEmployeeBookingInfo[];
  instantLocalTime: string;
  timezone: string;
}

export interface IGetAvailableTimeSlotsForBooking {
  date: string;
  employees: {
    id: number;
    name: string;
    date: string;
    availableSlots: string[];
  }[];
}
