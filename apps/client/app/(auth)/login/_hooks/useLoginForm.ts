'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { loginSchema, type LoginRequest } from '@sistema-barbearia/validators';

import loginAction from '@/app/actions/login';

export function useLoginForm() {
  const { register, handleSubmit, control, formState } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [error, setError] = useState('');

  const router = useRouter();

  const onSubmit = async (data: LoginRequest) => {
    const { ok, error } = await loginAction(data);

    if (!ok) {
      setError(error);
      return;
    }

    router.push('/panel/dashboard');
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
