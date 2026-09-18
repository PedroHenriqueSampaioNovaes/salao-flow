'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import registerRecruiterAction from '@/app/actions/registerRecruiter';

export function useRecruiterAccount() {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const onCreateAccount = async () => {
    setError('');
    setIsSubmitting(true);

    const { ok, error } = await registerRecruiterAction();

    if (!ok) {
      setError(error);
      setIsSubmitting(false);
      return;
    }

    router.push('/panel/dashboard');
  };

  return {
    error,
    isSubmitting,
    onCreateAccount,
  };
}
