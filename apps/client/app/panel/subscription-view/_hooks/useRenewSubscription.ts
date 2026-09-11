'use client';

import { useState } from 'react';

import createBillingPortalSessionAction from '@/app/actions/create-billing-portal-session';

import { showErrorToast } from '@/src/common/lib/toast';

export function useRenewSubscription() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleRenew = async () => {
    setIsRedirecting(true);

    const { data, ok, error } = await createBillingPortalSessionAction();

    if (!ok || !data) {
      showErrorToast(error);
      setIsRedirecting(false);
      return;
    }

    window.location.href = data.url;
  };

  return { isRedirecting, handleRenew };
}
