'use client';

import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  forgotPasswordSchema,
  type ForgotPasswordRequest,
} from '@sistema-barbearia/validators';

import forgotPasswordAction from '@/app/actions/forgotPassword';

export function useForgotPasswordForm() {
  const { register, handleSubmit, formState } = useForm<ForgotPasswordRequest>(
    {
      resolver: zodResolver(forgotPasswordSchema),
      defaultValues: {
        email: '',
      },
    },
  );
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data: ForgotPasswordRequest) => {
    setError('');

    const { ok, error } = await forgotPasswordAction(data);

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
