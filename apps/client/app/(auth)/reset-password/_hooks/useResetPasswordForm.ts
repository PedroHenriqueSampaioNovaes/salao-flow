'use client';

import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from '@sistema-barbearia/validators';

import resetPasswordAction from '@/app/actions/resetPassword';

export function useResetPasswordForm(token: string) {
  const { register, handleSubmit, formState } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
    },
  });
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data: ResetPasswordInput) => {
    setError('');

    const { ok, error } = await resetPasswordAction(data);

    if (!ok) {
      setError(error);
      return;
    }

    setIsSuccess(true);
  };

  return {
    register,
    handleSubmit,
    error,
    errors: formState.errors,
    isSubmitting: formState.isSubmitting,
    isSuccess,
    onSubmit,
  };
}
