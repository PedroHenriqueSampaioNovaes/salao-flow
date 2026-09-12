import { formatDateToBR } from '@/src/utils/formatDate.js';
import { formatPrice } from '@/src/utils/formatPrice.js';

export function buildAppointmentDetailsHtml(
  services: { name: string; price: number }[],
  date: string,
  time: string,
  employeeName: string,
) {
  const totalPrice = services.reduce(
    (sum, service) => sum + service.price,
    0,
  );

  const servicesListHtml = services
    .map(
      (service) => `<li>${service.name} - ${formatPrice(service.price)}</li>`,
    )
    .join('');

  return `<p><strong>Data:</strong> ${formatDateToBR(date)}</p>
        <p><strong>Horário:</strong> ${time}</p>
        <p><strong>Profissional:</strong> ${employeeName}</p>
        <p><strong>Serviços:</strong></p>
        <ul>${servicesListHtml}</ul>
        <p><strong>Total:</strong> ${formatPrice(totalPrice)}</p>`;
}
