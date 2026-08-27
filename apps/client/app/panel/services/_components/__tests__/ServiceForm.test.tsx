import { render, screen, fireEvent } from '@testing-library/react';
import { Control, useWatch } from 'react-hook-form';
import * as ReactHookForm from 'react-hook-form';

import { ServiceForm } from '../ServiceForm';
import { useServiceForm, ServiceFormData } from '../../_hooks/useServiceForm';
import { usePanelContext } from '@/src/common/contexts/panel-context';
import { IBarbershop } from '@/src/common/interfaces/barbershop';

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
    selected,
    onChange,
    ariaInvalid,
  }: {
    id?: string;
    options: Array<{ value: string; label: string }>;
    selected?: string[];
    onChange?: (values: string[]) => void;
    ariaInvalid?: boolean;
  }) => (
    <select
      id={id}
      multiple
      aria-invalid={ariaInvalid}
      value={selected}
      onChange={(e) => {
        const values = Array.from(e.target.selectedOptions).map(
          (opt) => opt.value,
        );
        onChange?.(values);
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock('react-hook-form', () => {
  const actual = jest.requireActual('react-hook-form');
  const controllerOnChange = jest.fn();
  return {
    ...actual,
    useWatch: jest.fn(),
    __controllerOnChange: controllerOnChange,
    Controller: ({
      name,
      render,
    }: {
      name: string;
      render: (props: {
        field: {
          value: unknown;
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
          value: name === 'employeeIds' ? [] : '',
          onChange: (...args: unknown[]) => controllerOnChange(name, ...args),
          onBlur: jest.fn(),
          ref: jest.fn(),
          name,
        },
        fieldState: {},
        formState: {},
      }),
  };
});

const mockControllerOnChange = (
  ReactHookForm as unknown as { __controllerOnChange: jest.Mock }
).__controllerOnChange;

const employees = [
  { id: 1, name: 'João', employeeScheduleId: '1', image: '', services: [] },
  { id: 2, name: 'Maria', employeeScheduleId: '2', image: '', services: [] },
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
      barbershop: {} as IBarbershop,
      appointments: [],
      services: [],
      expedients: [],
      blockedTimes: [],
      setBarbershop: jest.fn(),
      setEmployees: jest.fn(),
      setAppointments: jest.fn(),
      setServices: jest.fn(),
      setExpedients: jest.fn(),
      setBlockedTimes: jest.fn(),
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

  it('should register the name, duration and description fields', () => {
    render(<ServiceForm onSubmit={mockOnSubmit} />);

    expect(mockRegister).toHaveBeenCalledWith('name');
    expect(mockRegister).toHaveBeenCalledWith('duration');
    expect(mockRegister).toHaveBeenCalledWith('description');
  });

  it('should render the duration field as a number input with a minimum of 0', () => {
    render(<ServiceForm onSubmit={mockOnSubmit} />);

    const durationInput = screen.getByLabelText(/tempo \(em minutos\)/i);
    expect(durationInput).toHaveAttribute('type', 'number');
    expect(durationInput).toHaveAttribute('min', '0');
  });

  it('should limit the description field to 130 characters', () => {
    render(<ServiceForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/descrição/i)).toHaveAttribute(
      'maxlength',
      '130',
    );
  });

  it('should render the employee multi-select with options from the panel context', () => {
    (useWatch as jest.Mock).mockReturnValue(false);

    render(<ServiceForm onSubmit={mockOnSubmit} />);

    expect(
      screen.getByRole('option', { name: 'João' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Maria' }),
    ).toBeInTheDocument();
  });

  it('should call onChange with the selected employees when the multi-select changes', () => {
    (useWatch as jest.Mock).mockReturnValue(false);

    render(<ServiceForm onSubmit={mockOnSubmit} />);

    const professionalsSelect = screen.getByLabelText(
      /profissionais/i,
    ) as HTMLSelectElement;
    const joaoOption = screen.getByRole('option', {
      name: 'João',
    }) as HTMLOptionElement;
    joaoOption.selected = true;
    fireEvent.change(professionalsSelect);

    expect(mockControllerOnChange).toHaveBeenCalledWith('employeeIds', [
      '1',
    ]);
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

  it('should call onChange with the new value when the status switch is toggled', () => {
    render(<ServiceForm onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByLabelText(/serviço disponível/i));

    expect(mockControllerOnChange).toHaveBeenCalledWith('status', true);
  });

  it('should call onChange with the new value when the assignToAllEmployees switch is toggled', () => {
    render(<ServiceForm onSubmit={mockOnSubmit} />);

    fireEvent.click(
      screen.getByLabelText(/aplicar para todos os funcionários/i),
    );

    expect(mockControllerOnChange).toHaveBeenCalledWith(
      'assignToAllEmployees',
      true,
    );
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

  it('should forward defaultValues to useServiceForm', () => {
    const defaultValues = { name: 'Corte de cabelo', price: 50 };

    render(
      <ServiceForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />,
    );

    expect(useServiceForm).toHaveBeenCalledWith({ defaultValues });
  });

  it('should display validation errors when fields are invalid', () => {
    (useWatch as jest.Mock).mockReturnValue(false);
    jest.mocked(useServiceForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      control: {} as Control<ServiceFormData>,
      errors: {
        name: { type: 'required', message: 'Nome é obrigatório' },
        price: { type: 'required', message: 'Preço é obrigatório' },
        duration: { type: 'required', message: 'Duração é obrigatória' },
        status: { type: 'required', message: 'Status inválido' },
        assignToAllEmployees: {
          type: 'required',
          message: 'Campo inválido',
        },
        employeeIds: {
          type: 'required',
          message: 'Selecione ao menos um funcionário para atribuir o serviço',
        },
      },
    });

    render(<ServiceForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Preço é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Duração é obrigatória')).toBeInTheDocument();
    expect(screen.getByText('Status inválido')).toBeInTheDocument();
    expect(screen.getByText('Campo inválido')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Selecione ao menos um funcionário para atribuir o serviço',
      ),
    ).toBeInTheDocument();
  });

  it('should mark the employee multi-select as invalid when employeeIds has an error', () => {
    (useWatch as jest.Mock).mockReturnValue(false);
    jest.mocked(useServiceForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      control: {} as Control<ServiceFormData>,
      errors: {
        employeeIds: {
          type: 'required',
          message: 'Selecione ao menos um funcionário para atribuir o serviço',
        },
      },
    });

    render(<ServiceForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/profissionais/i)).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('should call handleSubmit with the provided onSubmit callback', () => {
    render(<ServiceForm onSubmit={mockOnSubmit} />);

    expect(mockHandleSubmit).toHaveBeenCalledWith(mockOnSubmit);
  });

  it('should call onSubmit when the form is submitted', () => {
    render(<ServiceForm onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(mockHandleSubmit).toHaveBeenCalled();
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});
