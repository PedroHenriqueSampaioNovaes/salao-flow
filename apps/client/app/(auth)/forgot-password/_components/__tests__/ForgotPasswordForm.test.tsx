import { render, screen } from '@testing-library/react';

import { ForgotPasswordForm } from '../ForgotPasswordForm';
import { useForgotPasswordForm } from '../../_hooks/useForgotPasswordForm';

jest.mock('../../_hooks/useForgotPasswordForm', () => ({
  useForgotPasswordForm: jest.fn(),
}));

describe('ForgotPasswordForm', () => {
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
    jest.mocked(useForgotPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      error: '',
      errors: {},
      isSubmitting: false,
      isSuccess: false,
      onSubmit: mockOnSubmit,
    });
  });

  it('should render email input and submit button', () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /enviar link/i }),
    ).toBeInTheDocument();
  });

  it('should display validation error when email is invalid', () => {
    jest.mocked(useForgotPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      error: '',
      errors: {
        email: { type: 'invalid', message: 'E-mail inválido.' },
      },
      isSubmitting: false,
      isSuccess: false,
      onSubmit: mockOnSubmit,
    });

    render(<ForgotPasswordForm />);

    expect(screen.getByText('E-mail inválido.')).toBeInTheDocument();
  });

  it('should disable submit button and render spinner when submitting', () => {
    jest.mocked(useForgotPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      error: '',
      errors: {},
      isSubmitting: true,
      isSuccess: false,
      onSubmit: mockOnSubmit,
    });

    render(<ForgotPasswordForm />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    const spinner = button.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should display error message when request fails', () => {
    jest.mocked(useForgotPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      error: 'E-mail não encontrado.',
      errors: {},
      isSubmitting: false,
      isSuccess: false,
      onSubmit: mockOnSubmit,
    });

    render(<ForgotPasswordForm />);

    expect(screen.getByText('E-mail não encontrado.')).toBeInTheDocument();
  });

  it('should display success dialog when email is sent', () => {
    jest.mocked(useForgotPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      error: '',
      errors: {},
      isSubmitting: false,
      isSuccess: true,
      onSubmit: mockOnSubmit,
    });

    render(<ForgotPasswordForm />);

    expect(screen.getByText('E-mail enviado')).toBeInTheDocument();
  });
});
