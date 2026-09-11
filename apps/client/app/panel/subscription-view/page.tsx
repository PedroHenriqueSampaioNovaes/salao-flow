import getSubscriptionAction from '@/app/actions/get-subscription';

import Subscription from './_components/Subscription';

export default async function SubscriptionViewPage() {
  const subscriptionResponse = await getSubscriptionAction();

  return (
    <Subscription
      subscription={subscriptionResponse.data}
      error={subscriptionResponse.error}
    />
  );
}
