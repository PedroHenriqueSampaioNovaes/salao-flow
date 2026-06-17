export function formatPrice(price: number, cents = 100) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price / cents);
}
