import Image from 'next/image';

import getBarbershopBookingInfosAction from '@/app/actions/get-barbershop-booking-infos';
import getAvailableTimeSlotsForBookingAction from '@/app/actions/get-available-time-slots-for-booking';

import BookingFormContainer from './_components/BookingFormContainer';

import { dateToInputDate } from '@/src/common/utils/dateToInputDate';
import { getLocalDateAsUTCDate } from '@/src/common/utils/getLocalDateAsUTCDate';

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: bookingInfos } = await getBarbershopBookingInfosAction(slug);

  if (!bookingInfos) {
    return <h1 className="text-3xl">Barbearia não encontrada</h1>;
  }

  const barbershopLocalDate = new Date(bookingInfos.instantLocalTime);
  const barbershopLocalDateUTC = getLocalDateAsUTCDate(
    barbershopLocalDate,
    bookingInfos.timezone,
  );

  const {
    data: availableTimeSlots,
    ok,
    error,
  } = await getAvailableTimeSlotsForBookingAction({
    slug,
    dateString: dateToInputDate(barbershopLocalDate, bookingInfos.timezone),
    lookForNextAvailableTimeSlot: 1,
  });

  if (!ok) {
    alert(error || 'Erro ao buscar horários disponíveis.');
    return;
  }

  return (
    <main className="min-h-screen py-10 px-4 md:px-8 bg-linear-to-br from-background to-background/95">
      <div className="max-w-4xl mx-auto mb-8 flex items-center gap-4">
        <Image
          className="rounded-full shadow-lg border border-border/80"
          width={64}
          height={64}
          src={bookingInfos.image}
          alt={bookingInfos.name}
        />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {bookingInfos.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Escolha profissional, serviços e horário desejados
          </p>
        </div>
      </div>

      <BookingFormContainer
        professionals={bookingInfos.employees}
        barbershopLocalDateUTC={barbershopLocalDateUTC}
        availableTimeSlots={availableTimeSlots}
      />
    </main>
  );
}
