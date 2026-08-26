import { render, screen } from '@testing-library/react';
import { Control } from 'react-hook-form';
import { LoginRequest } from '@sistema-barbearia/validators';

import { LoginForm } from '../LoginForm';
import { useLoginForm } from '../../_hooks/useLoginForm';

jest.mock('../../_hooks/useLoginForm');

describe('LoginForm', () => {
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
    jest.mocked(useLoginForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      control: {} as Control<LoginRequest>,
      error: '',
      errors: {},
      isSubmitting: false,
      onSubmit: mockOnSubmit,
    });
  });

  it('should render email and password inputs and the submit button', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('should display validation errors when fields are invalid', async () => {
    jest.mocked(useLoginForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      control: {} as Control<LoginRequest>,
      error: '',
      errors: {
        email: { type: 'invalid', message: 'E-mail inválido' },
        password: { type: 'required', message: 'A senha é obrigatória' },
      },
      isSubmitting: false,
      onSubmit: mockOnSubmit,
    });

    render(<LoginForm />);

    expect(screen.getByText('E-mail inválido')).toBeInTheDocument();
    expect(screen.getByText('A senha é obrigatória')).toBeInTheDocument();
  });

  it('should disable submit button and render spinner when submitting', () => {
    jest.mocked(useLoginForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      control: {} as Control<LoginRequest>,
      error: '',
      errors: {},
      isSubmitting: true,
      onSubmit: mockOnSubmit,
    });

    render(<LoginForm />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).not.toHaveTextContent('Entrar');
    const spinner = button.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should display error message when login fails', () => {
    jest.mocked(useLoginForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      control: {} as Control<LoginRequest>,
      error: 'Credenciais inválidas',
      errors: {},
      isSubmitting: false,
      onSubmit: mockOnSubmit,
    });

    render(<LoginForm />);

    expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
  });
});
