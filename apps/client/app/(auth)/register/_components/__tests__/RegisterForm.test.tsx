import { render, screen } from '@testing-library/react';
import { Control } from 'react-hook-form';
import { CreateBarbershopSchema } from '@sistema-barbearia/validators';

import { RegisterForm } from '../RegisterForm';
import { useRegisterForm } from '../../_hooks/useRegisterForm';

jest.mock('../../_hooks/useRegisterForm');
jest.mock('@/src/components/ui/phone-input-field', () => ({
  PhoneInputField: ({ label, error }: { label: string; error?: string }) => (
    <div>
      <label htmlFor="phone">{label}</label>
      <input id="phone" />
      {error && <div>{error}</div>}
    </div>
  ),
}));

describe('RegisterForm', () => {
  const mockRegister = jest.fn().mockImplementation((name) => ({
    name,
    onChange: jest.fn(),
    onBlur: jest.fn(),
    ref: jest.fn(),
  }));
  const mockHandleSubmit = jest
    .fn()
    .mockImplementation((fn) => (e: React.BaseSyntheticEvent) => {
      e?.preventDefault();
      fn();
    });
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useRegisterForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      control: {} as Control<CreateBarbershopSchema>,
      error: '',
      errors: {},
      isSubmitting: false,
      onSubmit: mockOnSubmit,
    });
  });

  it('should render all form inputs and the submit button', () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/endereço/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /cadastrar/i }),
    ).toBeInTheDocument();
  });

  it('should display validation errors when fields are invalid', () => {
    jest.mocked(useRegisterForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      control: {} as Control<CreateBarbershopSchema>,
      error: '',
      errors: {
        name: {
          type: 'required',
          message: 'Nome deve conter pelo menos 3 caracteres',
        },
        email: { type: 'required', message: 'E-mail inválido' },
        password: {
          type: 'required',
          message: 'Senha deve conter pelo menos 8 caracteres',
        },
        confirmPassword: {
          type: 'required',
          message: 'As senhas não coincidem',
        },
        address: { type: 'required', message: 'Endereço inválido' },
        phone: { type: 'required', message: 'Número de contato inválido' },
      },
      isSubmitting: false,
      onSubmit: mockOnSubmit,
    });

    render(<RegisterForm />);

    expect(
      screen.getByText('Nome deve conter pelo menos 3 caracteres'),
    ).toBeInTheDocument();
    expect(screen.getByText('E-mail inválido')).toBeInTheDocument();
    expect(
      screen.getByText('Senha deve conter pelo menos 8 caracteres'),
    ).toBeInTheDocument();
    expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument();
    expect(screen.getByText('Endereço inválido')).toBeInTheDocument();
    expect(screen.getByText('Número de contato inválido')).toBeInTheDocument();
  });

  it('should disable submit button and render spinner when submitting', () => {
    jest.mocked(useRegisterForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      control: {} as Control<CreateBarbershopSchema>,
      error: '',
      errors: {},
      isSubmitting: true,
      onSubmit: mockOnSubmit,
    });

    render(<RegisterForm />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.queryByText('Cadastrar')).not.toBeInTheDocument();
    const spinner = button.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
