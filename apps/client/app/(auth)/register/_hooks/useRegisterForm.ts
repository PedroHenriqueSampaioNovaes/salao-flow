'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createBarbershopSchema,
  type CreateBarbershopSchema,
} from '@sistema-barbearia/validators';

import { showErrorToast } from '@/src/common/lib/toast';

import registerAction from '@/app/actions/register';
import loginAction from '@/app/actions/login';
import { redirect } from 'next/navigation';

export function useRegisterForm() {
  const { register, handleSubmit, control, formState, setValue } =
    useForm<CreateBarbershopSchema>({
      resolver: zodResolver(createBarbershopSchema),
      defaultValues: {
        name: '',
        businessName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        timezone: '',
      },
    });
  const [error, setError] = useState('');

  useEffect(() => {
    setValue('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, [setValue]);

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
      showErrorToast('Não foi possível fazer login');
      return;
    }

    redirect('/panel/dashboard');
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
