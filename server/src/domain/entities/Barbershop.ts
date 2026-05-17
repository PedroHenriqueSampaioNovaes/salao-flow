import { AppointmentData } from './Appointment.js';

interface EmployeeData {
  id: number;
  name: string;
  image?: string | null;
  times: string[];
  appointments?: AppointmentData[];
}

interface BarbershopProps {
  id: number;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  image: string | null;
  status: boolean;
  customerId: string | null;
  employees: EmployeeData[];
}

export class Barbershop {
  private readonly _id: number;
  private _name: string;
  private _email: string;
  private _password: string;
  private _address: string;
  private _phone: string;
  private _image: string | null;
  private _status: boolean;
  private _customerId: string | null;
  private _employees: EmployeeData[];

  constructor(props: BarbershopProps) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
    this._address = props.address;
    this._phone = props.phone;
    this._image = props.image ?? null;
    this._status = props.status ?? true;
    this._customerId = props.customerId ?? null;
    this._employees = props.employees ?? [];
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get address(): string {
    return this._address;
  }

  get phone(): string {
    return this._phone;
  }

  get image(): string | null {
    return this._image;
  }

  get status(): boolean {
    return this._status;
  }

  get customerId(): string | null {
    return this._customerId;
  }

  get employees(): EmployeeData[] {
    return [...this._employees];
  }

  isActive(): boolean {
    return this._status;
  }

  static toPublic(barbershop: Barbershop) {
    return {
      name: barbershop.name,
      email: barbershop.email,
      address: barbershop.address,
      phone: barbershop.phone,
      image: barbershop.image,
      status: barbershop.status,
      customerId: barbershop.customerId,
      employees: barbershop.employees,
    };
  }
}
