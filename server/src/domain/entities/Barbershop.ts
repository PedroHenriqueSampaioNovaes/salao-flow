interface BarbershopProps {
  id: number;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  image?: string | null;
  status?: boolean;
  customerId?: string | null;
}

export class Barbershop {
  id: number;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  image?: string | null;
  status?: boolean;
  customerId?: string | null;

  constructor({
    id,
    name,
    email,
    password,
    address,
    phone,
    image,
    status,
    customerId,
  }: BarbershopProps) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.address = address;
    this.phone = phone;
    this.image = image;
    this.status = status;
    this.customerId = customerId;
  }
}
