import { renderHook, act } from '@testing-library/react';
import { useForgotPasswordForm } from '../useForgotPasswordForm';

import forgotPasswordAction from '@/app/actions/forgotPassword';

jest.mock('@/app/actions/forgotPassword', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useForgotPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state with default values', () => {
    const { result } = renderHook(() => useForgotPasswordForm());

    expect(result.current.error).toBe('');
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.handleSubmit).toBe('function');
    expect(typeof result.current.onSubmit).toBe('function');
  });

  it('should fail validation when email is empty', async () => {
    const { result } = renderHook(() => useForgotPasswordForm());

    await act(async () => {
      const submitFn = result.current.handleSubmit(result.current.onSubmit);
      await submitFn();
    });

    expect(result.current.errors.email?.message).toBe('E-mail inválido.');
  });

  it('should set isSuccess to true on successful submit', async () => {
    const mockForgotPassword = jest.mocked(forgotPasswordAction);
    mockForgotPassword.mockResolvedValue({ ok: true, data: null, error: '' });

    const { result } = renderHook(() => useForgotPasswordForm());
    const emailField = result.current.register('email');

    await act(async () => {
      await emailField.onChange({
        target: { name: 'email', value: 'teste@email.com' },
      });
    });

    await act(async () => {
      const submitFn = result.current.handleSubmit(result.current.onSubmit);
      await submitFn();
    });

    expect(mockForgotPassword).toHaveBeenCalledWith({
      email: 'teste@email.com',
    });
    expect(result.current.isSuccess).toBe(true);
  });

  it('should set error state if forgotPasswordAction fails', async () => {
    const mockForgotPassword = jest.mocked(forgotPasswordAction);
    mockForgotPassword.mockResolvedValue({
      ok: false,
      data: null,
      error: 'E-mail não encontrado.',
    });

    const { result } = renderHook(() => useForgotPasswordForm());
    const emailField = result.current.register('email');

    await act(async () => {
      await emailField.onChange({
        target: { name: 'email', value: 'teste@email.com' },
      });
    });

    await act(async () => {
      const submitFn = result.current.handleSubmit(result.current.onSubmit);
      await submitFn();
    });

    expect(mockForgotPassword).toHaveBeenCalled();
    expect(result.current.error).toBe('E-mail não encontrado.');
    expect(result.current.isSuccess).toBe(false);
  });
});
