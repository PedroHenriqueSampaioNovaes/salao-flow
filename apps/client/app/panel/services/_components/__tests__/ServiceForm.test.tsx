import { render, screen, fireEvent } from '@testing-library/react';
import { Control, useWatch } from 'react-hook-form';

import { ServiceForm } from '../ServiceForm';
import { useServiceForm, ServiceFormData } from '../../_hooks/useServiceForm';
import { usePanelContext } from '@/src/common/contexts/panel-context';

jest.mock('../../_hooks/useServiceForm');
jest.mock('@/src/common/contexts/panel-context');

jest.mock('@/src/components/ui/switch', () => ({
  Switch: ({
    id,
    checked,
    onCheckedChange,
  }: {
    id?: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }) => (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
    />
  ),
}));

jest.mock('@/src/components/ui/multi-select', () => ({
  MultiSelect: ({
    id,
    options,
  }: {
    id?: string;
    options: Array<{ value: string; label: string }>;
  }) => (
    <select id={id} multiple>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock('react-number-format', () => ({
  NumericFormat: ({ id }: { id?: string }) => (
    <input id={id} type="text" />
  ),
}));

jest.mock('react-hook-form', () => {
  const actual = jest.requireActual('react-hook-form');
  return {
    ...actual,
    useWatch: jest.fn(),
    Controller: ({
      render,
    }: {
      render: (props: {
        field: {
          value: string;
          onChange: (...args: unknown[]) => void;
          onBlur: (...args: unknown[]) => void;
          ref: (...args: unknown[]) => void;
          name: string;
        };
        fieldState: object;
        formState: object;
      }) => React.ReactNode;
    }) =>
      render({
        field: {
          value: '',
          onChange: jest.fn(),
          onBlur: jest.fn(),
          ref: jest.fn(),
          name: '',
        },
        fieldState: {},
        formState: {},
      }),
  };
});

const employees = [
  { id: 1, name: 'João', employeeScheduleId: '1', image: '' },
  { id: 2, name: 'Maria', employeeScheduleId: '2', image: '' },
];

describe('ServiceForm', () => {
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
    jest.mocked(useServiceForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      control: {} as Control<ServiceFormData>,
      errors: {},
    });
    jest.mocked(usePanelContext).mockReturnValue({
      employees,
      barbershop: null,
      appointments: [],
      services: [],
      setBarbershop: jest.fn(),
      setEmployees: jest.fn(),
      setAppointments: jest.fn(),
      setServices: jest.fn(),
    });
    (useWatch as jest.Mock).mockReturnValue(true);
  });

  it('should render all form fields and the submit button', () => {
    render(<ServiceForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preço/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tempo \(em minutos\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/serviço disponível/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/aplicar para todos os funcionários/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /salvar/i }),
    ).toBeInTheDocument();
  });

  it('should not render employee multi-select when assignToAllEmployees is true', () => {
    render(<ServiceForm onSubmit={mockOnSubmit} />);

    expect(
      screen.queryByLabelText(/profissionais/i),
    ).not.toBeInTheDocument();
  });

  it('should render employee multi-select when assignToAllEmployees is false', () => {
    (useWatch as jest.Mock).mockReturnValue(false);

    render(<ServiceForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/profissionais/i)).toBeInTheDocument();
  });

  it('should render the back link with correct href', () => {
    render(<ServiceForm onSubmit={mockOnSubmit} />);

    const backLink = screen.getByRole('link', { name: /voltar/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/panel/services');
  });

  it('should render with custom submit label', () => {
    render(<ServiceForm onSubmit={mockOnSubmit} submitLabel="Editar" />);

    expect(
      screen.getByRole('button', { name: /editar/i }),
    ).toBeInTheDocument();
  });

  it('should display validation errors when fields are invalid', () => {
    jest.mocked(useServiceForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      control: {} as Control<ServiceFormData>,
      errors: {
        name: { type: 'required', message: 'Nome é obrigatório' },
        price: { type: 'required', message: 'Preço é obrigatório' },
      },
    });

    render(<ServiceForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Preço é obrigatório')).toBeInTheDocument();
  });

  it('should call onSubmit when the form is submitted', () => {
    render(<ServiceForm onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(mockHandleSubmit).toHaveBeenCalled();
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});
