import { render, screen, fireEvent } from '@testing-library/react';

import { ProfessionalForm } from '../ProfessionalForm';
import { useProfessionalForm } from '../../_hooks/useProfessionalForm';

import { IEmployeeSchedule } from '@/src/common/interfaces/employee-schedule';

jest.mock('../../_hooks/useProfessionalForm');

const employeeSchedules: IEmployeeSchedule[] = [
  {
    id: '1',
    name: 'Segunda a Sexta',
    barbershop: 'barbearia1',
    isDefault: true,
    employeeScheduleWeekdays: [],
  },
  {
    id: '2',
    name: 'Fim de Semana',
    barbershop: 'barbearia1',
    isDefault: false,
    employeeScheduleWeekdays: [],
  },
];

describe('ProfessionalForm', () => {
  const mockRegister = jest.fn().mockImplementation((name) => ({
    name,
    onChange: jest.fn(),
    onBlur: jest.fn(),
    ref: jest.fn(),
  }));
  const mockHandleSubmit = jest
    .fn()
    .mockImplementation((fn) => (e?: React.BaseSyntheticEvent) => {
      e?.preventDefault?.();
      fn();
    });
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useProfessionalForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      errors: {},
      defaultEmployeeSchedule: employeeSchedules[0],
    });
  });

  it('should render all form fields and the submit button', () => {
    render(
      <ProfessionalForm
        employeeSchedules={employeeSchedules}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(screen.getByLabelText(/foto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expediente/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /salvar/i }),
    ).toBeInTheDocument();
  });

  it('should render employee schedule options', () => {
    render(
      <ProfessionalForm
        employeeSchedules={employeeSchedules}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(
      screen.getByRole('option', { name: /segunda a sexta/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: /fim de semana/i }),
    ).toBeInTheDocument();
  });

  it('should render the back link with correct href', () => {
    render(
      <ProfessionalForm
        employeeSchedules={employeeSchedules}
        onSubmit={mockOnSubmit}
      />,
    );

    const backLink = screen.getByRole('link', { name: /voltar/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/panel/professionals');
  });

  it('should render with custom submit label', () => {
    render(
      <ProfessionalForm
        employeeSchedules={employeeSchedules}
        onSubmit={mockOnSubmit}
        submitLabel="Editar"
      />,
    );

    expect(
      screen.getByRole('button', { name: /editar/i }),
    ).toBeInTheDocument();
  });

  it('should display validation errors when fields are invalid', () => {
    jest.mocked(useProfessionalForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      errors: {
        name: { type: 'required', message: 'Nome é obrigatório' },
        employeeScheduleId: {
          type: 'required',
          message: 'Expediente é obrigatório',
        },
      },
      defaultEmployeeSchedule: employeeSchedules[0],
    });

    render(
      <ProfessionalForm
        employeeSchedules={employeeSchedules}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Expediente é obrigatório')).toBeInTheDocument();
  });

  it('should call onSubmit when the form is submitted', () => {
    mockHandleSubmit.mockImplementation(
      (fn: typeof mockOnSubmit) => (e?: React.BaseSyntheticEvent) => {
        e?.preventDefault?.();
        fn();
      },
    );

    render(
      <ProfessionalForm
        employeeSchedules={employeeSchedules}
        onSubmit={mockOnSubmit}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(mockHandleSubmit).toHaveBeenCalled();
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('should pre-select the default employee schedule when no defaultValues are provided', () => {
    render(
      <ProfessionalForm
        employeeSchedules={employeeSchedules}
        onSubmit={mockOnSubmit}
      />,
    );

    const select = screen.getByLabelText(/expediente/i);
    expect(select).toHaveValue('1');
  });

  it('should pre-select the employee schedule from defaultValues when provided', () => {
    jest.mocked(useProfessionalForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      errors: {},
      defaultEmployeeSchedule: employeeSchedules[0],
    });

    render(
      <ProfessionalForm
        employeeSchedules={employeeSchedules}
        onSubmit={mockOnSubmit}
        defaultValues={{ employeeScheduleId: '2' }}
      />,
    );

    const select = screen.getByLabelText(/expediente/i);
    expect(select).toHaveValue('2');
  });
});
