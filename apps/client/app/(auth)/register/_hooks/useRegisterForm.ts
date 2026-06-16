import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createBarbershopSchema,
  type CreateBarbershopSchema,
} from '@sistema-barbearia/validators';

import { useState } from 'react';

import registerAction from '@/app/actions/register';
import loginAction from '@/app/actions/login';

export function useRegisterForm() {
  const { register, handleSubmit, control, formState } =
    useForm<CreateBarbershopSchema>({
      resolver: zodResolver(createBarbershopSchema),
      defaultValues: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
      },
    });
  const [error, setError] = useState('');

  const onSubmit = async (data: CreateBarbershopSchema) => {
    const { ok: registerOk, error } = await registerAction(data);

    if (!registerOk) {
      setError(error);
      return;
    }

    const { ok: loginOk } = await loginAction({
      email: data.email,
      password: data.password,
    });

    if (!loginOk) {
      console.log('Não foi possível fazer login');
      return;
    }
  };

  return {
    register,
    handleSubmit,
    control,
    error,
    errors: formState.errors,
    isSubmitting: formState.isSubmitting,
    onSubmit,
  };
}
