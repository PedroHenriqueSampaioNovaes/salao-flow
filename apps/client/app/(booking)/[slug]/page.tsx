import Image from 'next/image';
import { MapPin, Phone } from 'lucide-react';
import { notFound } from 'next/navigation';

import getBarbershopBookingInfosAction from '@/app/actions/get-barbershop-booking-infos';
import getAvailableTimeSlotsForBookingAction from '@/app/actions/get-available-time-slots-for-booking';

import BookingFormContainer from './_components/BookingFormContainer';

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: bookingInfos } = await getBarbershopBookingInfosAction(slug);

  if (!bookingInfos || !bookingInfos.status) return notFound();

  const { data: timeSlotsByProfessionalAndDate, ok } =
    await getAvailableTimeSlotsForBookingAction({
      slug,
    });

  if (!ok) return notFound();

  return (
    <main className="min-h-screen bg-appointment-background">
      <header className="w-full bg-appointment-foreground border-b border-appointment-border p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-5">
          <div className="size-20 rounded-2xl border border-appointment-border overflow-hidden shrink-0">
            <Image
              src={bookingInfos.image}
              alt={bookingInfos.businessName}
              width={96}
              height={96}
              unoptimized
              loading="eager"
              className="object-cover rounded-lg"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-lg sm:text-2xl font-bold text-appointment-text mb-2">
              {bookingInfos.businessName}
            </h1>

            <div className="flex max-sm:flex-col sm:items-center gap-y-1 gap-x-6">
              <div className="flex items-center gap-2 text-appointment-text-muted text-sm sm:text-base">
                <MapPin className="size-3.5 text-cta-accent shrink-0" />
                <span>{bookingInfos.address}</span>
              </div>

              <div className="flex items-center gap-2 text-appointment-text-muted text-sm sm:text-base">
                <Phone className="size-3.5 text-cta-accent shrink-0" />
                <span>{bookingInfos.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <BookingFormContainer
        barbershopBookingInfos={bookingInfos}
        timeSlotsByProfessionalAndDate={timeSlotsByProfessionalAndDate}
      />
    </main>
  );
}
