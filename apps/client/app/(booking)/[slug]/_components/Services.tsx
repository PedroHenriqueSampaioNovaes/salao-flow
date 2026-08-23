'use client';

import { AlertCircle, Check, Clock, Scissors } from 'lucide-react';

import { IEmployeeBookingInfo } from '@/src/common/interfaces/barbershop-booking';

import { formatPrice } from '@/src/common/utils/formatPrice';
import { cn } from '@/src/lib/utils';

import { useServices } from '../_hooks/useServices';

import StepTitle from './StepTitle';
import { Alert, AlertDescription } from '@/src/components/ui/alert';

interface IServicesProps {
  professionals: IEmployeeBookingInfo[];
}

export default function Services({ professionals }: IServicesProps) {
  const {
    selectedProfessional,
    selectedServiceIds,
    serviceIdsError,
    handleServiceToggle,
  } = useServices(professionals);

  return (
    <div className="animate-in fade-in duration-300">
      <StepTitle
        title={`Selecione os Serviços de ${selectedProfessional?.name}`}
        icon={Scissors}
      />

      {serviceIdsError && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="size-6" />
          <AlertDescription>{serviceIdsError.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {selectedProfessional?.services.map(
          ({ id, name, duration, price, description }) => {
            const isServiceSelected = selectedServiceIds.includes(id);

            return (
              <button
                key={id}
                type="button"
                onClick={() => handleServiceToggle(id)}
                className={cn(
                  'appointment-card-background p-4 border border-appointment-border rounded-lg cursor-pointer',
                  isServiceSelected &&
                    'border-cta-accent bg-appointment-border/50',
                )}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-lg text-bold text-white">{name}</h4>
                  <div className="size-5 rounded bg-appointment-border flex items-center justify-center transition-colors">
                    {isServiceSelected && (
                      <Check className="size-4 text-cta-accent" />
                    )}
                  </div>
                </div>
                {description && (
                  <p className="text-left text-sm text-appointment-text-muted mt-2 max-w-125">
                    {description}
                  </p>
                )}
                <div className="flex items-center justify-between gap-3 mt-3">
                  <span className="flex items-center gap-2 text-sm text-appointment-text-muted">
                    <Clock className="size-3" />
                    {duration} minutos
                  </span>
                  <span className="font-bold text-cta-accent">
                    {formatPrice(price)}
                  </span>
                </div>
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}
