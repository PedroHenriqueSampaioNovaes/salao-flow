export interface AppointmentData {
  id: number;
  name: string;
  phone: string;
  date: Date;
  time: string;
}

export class Appointment {
  constructor(
    public name: string,
    public phone: string,
    public date: Date,
    public time: string,
  ) {}
}
