import { render, screen, fireEvent } from '@testing-library/react';

import NewAppointmentDialog from '../NewAppointmentDialog';

import { usePanelContext } from '@/src/common/contexts/panel-context';
import { IBarbershop } from '@/src/common/interfaces/barbershop';

jest.mock('@/src/common/contexts/panel-context');

const employees = [
  { id: 1, name: 'João', employeeScheduleId: '1', image: '' },
  { id: 2, name: 'Maria', employeeScheduleId: '2', image: '' },
];

describe('NewAppointmentDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(usePanelContext).mockReturnValue({
      employees,
      barbershop: {} as IBarbershop,
      appointments: [],
      services: [],
      setBarbershop: jest.fn(),
      setEmployees: jest.fn(),
      setAppointments: jest.fn(),
      setServices: jest.fn(),
    });
  });

  it('should render the trigger button', () => {
    render(<NewAppointmentDialog employee="" />);

    expect(
      screen.getByRole('button', { name: /novo agendamento/i }),
    ).toBeInTheDocument();
  });

  it('should open the dialog with the client name and professional fields', () => {
    render(<NewAppointmentDialog employee="" />);

    fireEvent.click(screen.getByRole('button', { name: /novo agendamento/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/nome do cliente/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profissional/i)).toBeInTheDocument();
    expect(screen.getByText('João')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /cancelar/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /criar agendamento/i }),
    ).toBeInTheDocument();
  });

  it('should pre-select the employee passed via props', () => {
    render(<NewAppointmentDialog employee={2} />);

    fireEvent.click(screen.getByRole('button', { name: /novo agendamento/i }));

    expect(screen.getByLabelText(/profissional/i)).toHaveValue('2');
  });
});
