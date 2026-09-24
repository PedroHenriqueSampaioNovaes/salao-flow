import { renderHook, act } from '@testing-library/react';
import { useLoginForm } from '../useLoginForm';

import loginAction from '@/app/actions/login';

jest.mock('@/app/actions/login', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('useLoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state with default values', () => {
    const { result } = renderHook(() => useLoginForm());

    expect(result.current.error).toBe('');
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.handleSubmit).toBe('function');
    expect(typeof result.current.onSubmit).toBe('function');
    expect(result.current.control).toBeDefined();
  });

  it('should fail validation when fields are empty', async () => {
    const { result } = renderHook(() => useLoginForm());

    await act(async () => {
      const submitFn = result.current.handleSubmit(result.current.onSubmit);
      await submitFn();
    });

    expect(result.current.errors.email?.message).toBe('E-mail inválido');
    expect(result.current.errors.password?.message).toBe(
      'A senha é obrigatória',
    );
  });

  it('should call loginAction on successful submit', async () => {
    const mockLogin = jest.mocked(loginAction);
    mockLogin.mockResolvedValue({ ok: true, data: null, error: '' });

    const { result } = renderHook(() => useLoginForm());
    const emailField = result.current.register('email');
    const passwordField = result.current.register('password');

    await act(async () => {
      await emailField.onChange({
        target: { name: 'email', value: 'teste@email.com' },
      });
      await passwordField.onChange({
        target: { name: 'password', value: '123456' },
      });
    });

    await act(async () => {
      const submitFn = result.current.handleSubmit(result.current.onSubmit);
      await submitFn();
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'teste@email.com',
      password: '123456',
    });
    expect(mockPush).toHaveBeenCalledWith('/panel/dashboard');
  });

  it('should not redirect if loginAction fails', async () => {
    const mockLogin = jest.mocked(loginAction);
    mockLogin.mockResolvedValue({
      ok: false,
      data: null,
      error: 'Login falhou',
    });

    const { result } = renderHook(() => useLoginForm());
    const emailField = result.current.register('email');
    const passwordField = result.current.register('password');

    await act(async () => {
      await emailField.onChange({
        target: { name: 'email', value: 'teste@email.com' },
      });
      await passwordField.onChange({
        target: { name: 'password', value: '123456' },
      });
    });

    await act(async () => {
      const submitFn = result.current.handleSubmit(result.current.onSubmit);
      await submitFn();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should set error state if loginAction fails', async () => {
    const mockLogin = jest.mocked(loginAction);
    mockLogin.mockResolvedValue({
      ok: false,
      data: null,
      error: 'Login falhou',
    });

    const { result } = renderHook(() => useLoginForm());
    const emailField = result.current.register('email');
    const passwordField = result.current.register('password');

    await act(async () => {
      await emailField.onChange({
        target: { name: 'email', value: 'teste@email.com' },
      });
      await passwordField.onChange({
        target: { name: 'password', value: '123456' },
      });
    });

    await act(async () => {
      const submitFn = result.current.handleSubmit(result.current.onSubmit);
      await submitFn();
    });

    expect(mockLogin).toHaveBeenCalled();
    expect(result.current.error).toBe('Login falhou');
  });
});
