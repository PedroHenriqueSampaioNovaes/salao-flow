export type SubscriptionStatus =
  | 'ACTIVE'
  | 'TRIALING'
  | 'PAST_DUE'
  | 'PAUSED'
  | 'CANCELED';

export interface ISubscription {
  plan: string;
  status: SubscriptionStatus;
  price: number;
  currentPeriodEnd: string;
}
