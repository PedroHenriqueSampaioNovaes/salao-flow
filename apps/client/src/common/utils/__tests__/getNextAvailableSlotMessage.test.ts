import { getNextAvailableSlotMessage } from '../getNextAvailableSlotMessage';

describe('getNextAvailableSlotMessage', () => {
  const barbershopLocalDateUTC = new Date(Date.UTC(2026, 5, 30, 10, 0, 0)); // 30/06/2026

  it('should return the "no slots" message when there is no available slot', () => {
    const result = getNextAvailableSlotMessage(
      barbershopLocalDateUTC,
      '2026-06-30',
      '',
    );
    expect(result).toBe('Sem horários nos próximos 10 dias');
  });

  it('should return "Hoje" when the shift is today', () => {
    const result = getNextAvailableSlotMessage(
      barbershopLocalDateUTC,
      '2026-06-30',
      '10:30',
    );
    expect(result).toBe('Hoje, às 10:30');
  });

  it('should return "Amanhã" when the shift is tomorrow', () => {
    const result = getNextAvailableSlotMessage(
      barbershopLocalDateUTC,
      '2026-07-01',
      '08:00',
    );
    expect(result).toBe('Amanhã, às 08:00');
  });

  it('should return a formatted date when the shift is on another day', () => {
    const result = getNextAvailableSlotMessage(
      barbershopLocalDateUTC,
      '2026-07-03',
      '14:00',
    );
    expect(result).toBe('03/07/2026, às 14:00');
  });
});
