'use client';

import { Check, Info } from 'lucide-react';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { ISubscription } from '@/src/common/interfaces/subscription';

import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { Button } from '@/src/components/ui/button';
import LoadingSecondary from '@/src/components/ui/loading-secondary';

import PageHeader from '../../_components/PageHeader';

import { useRenewSubscription } from '../_hooks/useRenewSubscription';
import { getLocalDateAsUTCDate } from '@/src/common/utils/getLocalDateAsUTCDate';

const dueDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
});

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const BLOCKING_STATUSES = ['PAST_DUE', 'PAUSED', 'CANCELED'];

interface ISubscriptionProps {
  subscription: ISubscription | null;
  error: string;
}

export default function Subscription({
  subscription,
  error,
}: ISubscriptionProps) {
  const { barbershop } = usePanelContext();
  const { isRedirecting, handleRenew } = useRenewSubscription();

  if (!subscription) {
    return (
      <>
        <PageHeader
          title="Assinatura"
          description="Renove para manter sua agenda online, os lembretes e o painel ativos."
        />
        <p className="text-sm text-secondary">
          {error || 'Não foi possível carregar os dados da sua assinatura.'}
        </p>
      </>
    );
  }

  const now = getLocalDateAsUTCDate(
    new Date(barbershop.instantLocalTime),
    barbershop.timezone,
  );
  const currentPeriodEnd = getLocalDateAsUTCDate(
    new Date(subscription.currentPeriodEnd),
    barbershop.timezone,
  );
  const daysUntilDue = (currentPeriodEnd.getTime() - now.getTime()) / 86400000;

  const isBlocked = BLOCKING_STATUSES.includes(subscription.status);

  return (
    <>
      <PageHeader
        title="Assinatura"
        description="Renove para manter sua agenda online e o painel ativo."
      />

      <div className="max-w-140 mx-auto">
        {isBlocked && (
          <Alert variant="destructive">
            <Info className="size-4.5 shrink-0 mt-0.5" />
            <AlertDescription className="text-pretty">
              Sua assinatura está vencida. Renove agora para manter sua agenda
              online, os lembretes e o painel ativos.
            </AlertDescription>
          </Alert>
        )}
        {!isBlocked && (
          <Alert variant="accent">
            <Info className="size-4.5 shrink-0 mt-0.5" />
            <AlertDescription className="text-pretty">
              Seu plano vence em{' '}
              <strong className="font-bold">
                {daysUntilDue < 1
                  ? 'breve'
                  : daysUntilDue < 2
                    ? `${Math.floor(daysUntilDue)} dia`
                    : `${Math.floor(daysUntilDue)} dias`}
              </strong>
              , no dia{' '}
              {dueDateFormatter.format(new Date(subscription.currentPeriodEnd))}
              . Depois disso a página de agendamento sairá do ar e não poderá
              ser acessada.
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-2xl shadow shadow-neutral/20 overflow-hidden mt-6">
          <div className="p-6 flex flex-col gap-5">
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-xs font-bold text-brand-accent tracking-wide uppercase">
                  Plano atual
                </span>
                <span className="text-2xl font-bold text-black">
                  Plano {subscription.plan}
                </span>
              </div>
              <div className="flex items-baseline gap-1 shrink-0">
                <span className="text-base text-secondary">R$</span>
                <span className="text-4xl font-bold text-black">
                  {priceFormatter.format(subscription.price)}
                </span>
                <span className="text-sm text-secondary">/mês</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="size-5 shrink-0 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span className="text-sm text-neutral">
                  Acesso a todos os recursos da plataforma
                </span>
              </div>
            </div>
            <Button
              type="button"
              onClick={handleRenew}
              disabled={isRedirecting}
              className="w-full h-14 bg-brand-accent text-white hover:bg-accent font-bold"
            >
              {isRedirecting ? <LoadingSecondary /> : 'Renovar assinatura'}
            </Button>
            <span className="text-xs text-secondary text-center">
              Pagamento via cartão. Você pode cancelar quando quiser.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
