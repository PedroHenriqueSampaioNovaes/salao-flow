import Image from 'next/image';
import Link from 'next/link';

interface IContactsProps {
  whatsAppUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export default function Contacts({
  whatsAppUrl,
  facebookUrl,
  instagramUrl,
}: IContactsProps) {
  if (!whatsAppUrl && !facebookUrl && !instagramUrl) return null;

  return (
    <div className="bg-appointment-foreground rounded-lg p-4 border border-appointment-border mt-6">
      <h3 className="text-xl">Contato</h3>
      <hr className="border-divider-appointment" />

      <div className="flex items-center gap-8">
        {whatsAppUrl && (
          <Link href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
            <Image src="/whatsapp.png" alt="WhatsApp" width={46} height={46} />
          </Link>
        )}
        {instagramUrl && (
          <Link href={instagramUrl} target="_blank" rel="noopener noreferrer">
            <Image
              src="/instagram.png"
              alt="Instagram"
              width={40}
              height={40}
            />
          </Link>
        )}
        {facebookUrl && (
          <Link href={facebookUrl} target="_blank" rel="noopener noreferrer">
            <Image src="/facebook.png" alt="Facebook" width={40} height={40} />
          </Link>
        )}
      </div>
    </div>
  );
}
