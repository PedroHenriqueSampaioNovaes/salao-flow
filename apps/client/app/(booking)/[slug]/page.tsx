import Image from 'next/image';

import getBarbershopBookingInfosAction from '@/app/actions/get-barbershop-booking-infos';
import getAvailableTimeSlotsForBookingAction from '@/app/actions/get-available-time-slots-for-booking';

import Professionals from './_components/Professionals';
import Booking from './_components/Booking';

import { dateToInputDate } from '@/src/common/utils/dateToInputDate';
import { getLocalDateAsUTCDate } from '@/src/common/utils/getLocalDateAsUTCDate';

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: bookingInfos } = await getBarbershopBookingInfosAction(slug);

  console.log(bookingInfos);

  if (!bookingInfos) {
    return <h1 className="text-3xl">Barbearia não encontrada</h1>;
  }

  const barbershopLocalDate = new Date(bookingInfos.instantLocalTime);
  const barbershopLocalDateUTC = getLocalDateAsUTCDate(
    barbershopLocalDate,
    bookingInfos.timezone,
  );

  // console.log(getEmployeeNextAvailableTime(bookingInfos.employees[2]));

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
    <main>
      <h1>
        <Image
          className="rounded-full"
          width={64}
          height={64}
          src={bookingInfos.image}
          alt={bookingInfos.name}
        />
        {bookingInfos.name}
      </h1>

      <Professionals
        professionals={bookingInfos.employees}
        barbershopLocalDateUTC={barbershopLocalDateUTC}
        employeesShiftData={availableTimeSlots.employees}
      />
      <Booking
        barbershopLocalDateUTC={barbershopLocalDateUTC}
        availableTimeSlots={availableTimeSlots}
      />
    </main>
  );
}
