import { render, screen } from '@testing-library/react';

import { ResetPasswordForm } from '../ResetPasswordForm';
import { useResetPasswordForm } from '../../_hooks/useResetPasswordForm';

jest.mock('../../_hooks/useResetPasswordForm');

describe('ResetPasswordForm', () => {
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
    jest.mocked(useResetPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      error: '',
      errors: {},
      isSubmitting: false,
      isSuccess: false,
      onSubmit: mockOnSubmit,
    });
  });

  it('should render password input and submit button', () => {
    render(<ResetPasswordForm token="abc123" />);

    expect(screen.getByLabelText(/nova senha/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /redefinir senha/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /voltar para o login/i }),
    ).toHaveAttribute('href', '/login');
  });

  it('should pass the token down when the form is submitted', () => {
    render(<ResetPasswordForm token="abc123" />);

    expect(useResetPasswordForm).toHaveBeenCalledWith('abc123');
  });

  it('should display validation error when password is invalid', () => {
    jest.mocked(useResetPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      error: '',
      errors: {
        password: {
          type: 'invalid',
          message: 'Senha deve ter pelo menos 8 caracteres.',
        },
      },
      isSubmitting: false,
      isSuccess: false,
      onSubmit: mockOnSubmit,
    });

    render(<ResetPasswordForm token="abc123" />);

    expect(
      screen.getByText('Senha deve ter pelo menos 8 caracteres.'),
    ).toBeInTheDocument();
  });

  it('should disable submit button and render spinner when submitting', () => {
    jest.mocked(useResetPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      error: '',
      errors: {},
      isSubmitting: true,
      isSuccess: false,
      onSubmit: mockOnSubmit,
    });

    render(<ResetPasswordForm token="abc123" />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    const spinner = button.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should display error message when request fails', () => {
    jest.mocked(useResetPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      error: 'Token de resete de senha inválido ou expirado.',
      errors: {},
      isSubmitting: false,
      isSuccess: false,
      onSubmit: mockOnSubmit,
    });

    render(<ResetPasswordForm token="abc123" />);

    expect(
      screen.getByText('Token de resete de senha inválido ou expirado.'),
    ).toBeInTheDocument();
  });

  it('should display success dialog when password is reset', () => {
    jest.mocked(useResetPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      error: '',
      errors: {},
      isSubmitting: false,
      isSuccess: true,
      onSubmit: mockOnSubmit,
    });

    render(<ResetPasswordForm token="abc123" />);

    expect(screen.getByText('Senha redefinida')).toBeInTheDocument();
  });

  it('should display a link to login inside the success dialog', () => {
    jest.mocked(useResetPasswordForm).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      error: '',
      errors: {},
      isSubmitting: false,
      isSuccess: true,
      onSubmit: mockOnSubmit,
    });

    render(<ResetPasswordForm token="abc123" />);

    expect(
      screen.getByRole('link', { name: /ir para o login/i }),
    ).toHaveAttribute('href', '/login');
  });
});
