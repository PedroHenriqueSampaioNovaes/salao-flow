export interface IBarbershop {
  id: number;
  email: string;
  name: string;
  businessName: string;
  image: string;
  address: string;
  phone: string;
  status: boolean;
  slug: string;
  timezone: string;
  instantLocalTime: string;
}

export interface IDashboardMetrics {
  customerCount: number;
  employeeCount: number;
  serviceCount: number;
  todayAppointmentsCount: number;
}
