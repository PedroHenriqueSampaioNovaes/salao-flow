import { renderHook, act } from '@testing-library/react';
import { useRegisterForm } from '../useRegisterForm';
import registerAction from '@/app/actions/register';
import loginAction from '@/app/actions/login';
import { showErrorToast } from '@/src/common/lib/toast';

jest.mock('@/app/actions/register', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/app/actions/login', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/src/common/lib/toast', () => ({
  showErrorToast: jest.fn(),
}));

const mockRedirect = jest.fn();

jest.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}));

const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

describe('useRegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state with default values', () => {
    const { result } = renderHook(() => useRegisterForm());

    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.handleSubmit).toBe('function');
    expect(typeof result.current.onSubmit).toBe('function');
  });

  it('should fail validation when fields are empty', async () => {
    const { result } = renderHook(() => useRegisterForm());

    await act(async () => {
      const submitFn = result.current.handleSubmit(result.current.onSubmit);
      await submitFn();
    });

    expect(result.current.errors.name?.message).toBe(
      'Nome deve conter pelo menos 3 caracteres',
    );
    expect(result.current.errors.businessName?.message).toBe(
      'Nome do negócio deve conter pelo menos 3 caracteres',
    );
    expect(result.current.errors.email?.message).toBe('E-mail inválido');
    expect(result.current.errors.password?.message).toBe(
      'Senha deve conter pelo menos 8 caracteres',
    );
    expect(result.current.errors.address?.message).toBe('Endereço inválido');
    expect(result.current.errors.phone?.message).toBe(
      'Número de contato inválido',
    );
  });

  it('should fail validation when passwords do not match', async () => {
    const { result } = renderHook(() => useRegisterForm());

    const nameField = result.current.register('name');
    const businessNameField = result.current.register('businessName');
    const emailField = result.current.register('email');
    const passwordField = result.current.register('password');
    const confirmPasswordField = result.current.register('confirmPassword');
    const addressField = result.current.register('address');
    const phoneField = result.current.register('phone');

    await act(async () => {
      await nameField.onChange({
        target: { name: 'name', value: 'Barbearia do Pedro' },
      });
      await businessNameField.onChange({
        target: { name: 'businessName', value: 'Barbearia do Pedro LTDA' },
      });
      await emailField.onChange({
        target: { name: 'email', value: 'pedro@example.com' },
      });
      await passwordField.onChange({
        target: { name: 'password', value: 'password123' },
      });
      await confirmPasswordField.onChange({
        target: { name: 'confirmPassword', value: 'different123' },
      });
      await addressField.onChange({
        target: { name: 'address', value: 'Rua das Flores, 123' },
      });
      await phoneField.onChange({
        target: { name: 'phone', value: '(11) 99999-9999' },
      });
    });

    await act(async () => {
      const submitFn = result.current.handleSubmit(result.current.onSubmit);
      await submitFn();
    });

    expect(result.current.errors.confirmPassword?.message).toBe(
      'As senhas não coincidem',
    );
  });

  it('should call registerAction and then loginAction on successful submit', async () => {
    const mockRegister = jest.mocked(registerAction);
    const mockLogin = jest.mocked(loginAction);

    mockRegister.mockResolvedValue({ ok: true, data: null, error: '' });
    mockLogin.mockResolvedValue({ ok: true, data: null, error: '' });

    const { result } = renderHook(() => useRegisterForm());

    const nameField = result.current.register('name');
    const businessNameField = result.current.register('businessName');
    const emailField = result.current.register('email');
    const passwordField = result.current.register('password');
    const confirmPasswordField = result.current.register('confirmPassword');
    const addressField = result.current.register('address');
    const phoneField = result.current.register('phone');

    await act(async () => {
      await nameField.onChange({
        target: { name: 'name', value: 'Barbearia do Pedro' },
      });
      await businessNameField.onChange({
        target: { name: 'businessName', value: 'Barbearia do Pedro LTDA' },
      });
      await emailField.onChange({
        target: { name: 'email', value: 'pedro@example.com' },
      });
      await passwordField.onChange({
        target: { name: 'password', value: 'password123' },
      });
      await confirmPasswordField.onChange({
        target: { name: 'confirmPassword', value: 'password123' },
      });
      await addressField.onChange({
        target: { name: 'address', value: 'Rua das Flores, 123' },
      });
      await phoneField.onChange({
        target: { name: 'phone', value: '(11) 99999-9999' },
      });
    });

    await act(async () => {
      const submitFn = result.current.handleSubmit(result.current.onSubmit);
      await submitFn();
    });

    expect(mockRegister).toHaveBeenCalledWith({
      name: 'Barbearia do Pedro',
      businessName: 'Barbearia do Pedro LTDA',
      email: 'pedro@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      address: 'Rua das Flores, 123',
      phone: '(11) 99999-9999',
      timezone: TIMEZONE,
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'pedro@example.com',
      password: 'password123',
    });

    expect(mockRedirect).toHaveBeenCalledWith('/panel/dashboard');
  });

  it('should set error and not call loginAction if registerAction fails', async () => {
    const mockRegister = jest.mocked(registerAction);
    const mockLogin = jest.mocked(loginAction);

    mockRegister.mockResolvedValue({
      ok: false,
      data: null,
      error: 'Criação de conta falhou!',
    });

    const { result } = renderHook(() => useRegisterForm());

    const nameField = result.current.register('name');
    const businessNameField = result.current.register('businessName');
    const emailField = result.current.register('email');
    const passwordField = result.current.register('password');
    const confirmPasswordField = result.current.register('confirmPassword');
    const addressField = result.current.register('address');
    const phoneField = result.current.register('phone');

    await act(async () => {
      await nameField.onChange({
        target: { name: 'name', value: 'Barbearia do Pedro' },
      });
      await businessNameField.onChange({
        target: { name: 'businessName', value: 'Barbearia do Pedro LTDA' },
      });
      await emailField.onChange({
        target: { name: 'email', value: 'pedro@example.com' },
      });
      await passwordField.onChange({
        target: { name: 'password', value: 'password123' },
      });
      await confirmPasswordField.onChange({
        target: { name: 'confirmPassword', value: 'password123' },
      });
      await addressField.onChange({
        target: { name: 'address', value: 'Rua das Flores, 123' },
      });
      await phoneField.onChange({
        target: { name: 'phone', value: '(11) 99999-9999' },
      });
    });

    await act(async () => {
      const submitFn = result.current.handleSubmit(result.current.onSubmit);
      await submitFn();
    });

    expect(mockRegister).toHaveBeenCalled();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(result.current.error).toBe('Criação de conta falhou!');
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('should show an error toast if loginAction fails after successful register', async () => {
    const mockRegister = jest.mocked(registerAction);
    const mockLogin = jest.mocked(loginAction);

    mockRegister.mockResolvedValue({ ok: true, data: null, error: '' });
    mockLogin.mockResolvedValue({
      ok: false,
      data: null,
      error: 'Login Falhou',
    });

    const { result } = renderHook(() => useRegisterForm());

    const nameField = result.current.register('name');
    const businessNameField = result.current.register('businessName');
    const emailField = result.current.register('email');
    const passwordField = result.current.register('password');
    const confirmPasswordField = result.current.register('confirmPassword');
    const addressField = result.current.register('address');
    const phoneField = result.current.register('phone');

    await act(async () => {
      await nameField.onChange({
        target: { name: 'name', value: 'Barbearia do Pedro' },
      });
      await businessNameField.onChange({
        target: { name: 'businessName', value: 'Barbearia do Pedro LTDA' },
      });
      await emailField.onChange({
        target: { name: 'email', value: 'pedro@example.com' },
      });
      await passwordField.onChange({
        target: { name: 'password', value: 'password123' },
      });
      await confirmPasswordField.onChange({
        target: { name: 'confirmPassword', value: 'password123' },
      });
      await addressField.onChange({
        target: { name: 'address', value: 'Rua das Flores, 123' },
      });
      await phoneField.onChange({
        target: { name: 'phone', value: '(11) 99999-9999' },
      });
    });

    await act(async () => {
      const submitFn = result.current.handleSubmit(result.current.onSubmit);
      await submitFn();
    });

    expect(mockRegister).toHaveBeenCalled();
    expect(mockLogin).toHaveBeenCalled();
    expect(showErrorToast).toHaveBeenCalledWith('Não foi possível fazer login');
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
