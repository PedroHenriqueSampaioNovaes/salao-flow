interface UserProps {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  times: string[];
  image?: string | null;
  status?: boolean;
  customerId?: string | null;
}

export class User {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  times: string[];
  image?: string | null;
  status?: boolean;
  customerId?: string | null;

  constructor({
    name,
    email,
    password,
    address,
    phone,
    times,
    image,
    status,
    customerId,
  }: UserProps) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.address = address;
    this.phone = phone;
    this.times = times;
    this.image = image;
    this.status = status;
    this.customerId = customerId;
  }
}
