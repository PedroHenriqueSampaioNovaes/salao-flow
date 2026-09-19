import { renderHook, act } from '@testing-library/react';

import { useResetPasswordForm } from '../useResetPasswordForm';

import resetPasswordAction from '@/app/actions/resetPassword';

jest.mock('@/app/actions/resetPassword', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useResetPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state with default values', () => {
    const { result } = renderHook(() => useResetPasswordForm('abc123'));

    expect(result.current.error).toBe('');
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.handleSubmit).toBe('function');
    expect(typeof result.current.onSubmit).toBe('function');
  });

  it('should fail validation when password is too short', async () => {
    const { result } = renderHook(() => useResetPasswordForm('abc123'));

    await act(async () => {
      const submitFn = result.current.handleSubmit(result.current.onSubmit);
      await submitFn();
    });

    expect(result.current.errors.password?.message).toBe(
      'Senha deve ter pelo menos 8 caracteres.',
    );
  });

  it('should call resetPasswordAction with token and password on submit', async () => {
    const mockResetPassword = jest.mocked(resetPasswordAction);
    mockResetPassword.mockResolvedValue({ ok: true, data: null, error: '' });

    const { result } = renderHook(() => useResetPasswordForm('abc123'));
    const passwordField = result.current.register('password');

    await act(async () => {
      await passwordField.onChange({
        target: { name: 'password', value: 'novaSenha123' },
      });
    });

    await act(async () => {
      const submitFn = result.current.handleSubmit(result.current.onSubmit);
      await submitFn();
    });

    expect(mockResetPassword).toHaveBeenCalledWith({
      token: 'abc123',
      password: 'novaSenha123',
    });
    expect(result.current.isSuccess).toBe(true);
  });

  it('should set error state if resetPasswordAction fails', async () => {
    const mockResetPassword = jest.mocked(resetPasswordAction);
    mockResetPassword.mockResolvedValue({
      ok: false,
      data: null,
      error: 'Token de resete de senha inválido ou expirado.',
    });

    const { result } = renderHook(() => useResetPasswordForm('abc123'));
    const passwordField = result.current.register('password');

    await act(async () => {
      await passwordField.onChange({
        target: { name: 'password', value: 'novaSenha123' },
      });
    });

    await act(async () => {
      const submitFn = result.current.handleSubmit(result.current.onSubmit);
      await submitFn();
    });

    expect(result.current.error).toBe(
      'Token de resete de senha inválido ou expirado.',
    );
    expect(result.current.isSuccess).toBe(false);
  });
});
