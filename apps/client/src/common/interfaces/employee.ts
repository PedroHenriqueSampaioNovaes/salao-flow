export interface IEmployee {
  id: number;
  employeeScheduleId: string;
  name: string;
  image: string;
}

export interface ICreateEmployee {
  name: string;
  image?: string;
  employeeScheduleId: string;
}
