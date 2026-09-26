import Image from 'next/image';
import Link from 'next/link';

interface IContactsProps {
  whatsAppUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
}

function withProtocol(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export default function Contacts({
  whatsAppUrl,
  facebookUrl,
  instagramUrl,
  tiktokUrl,
}: IContactsProps) {
  if (!whatsAppUrl && !facebookUrl && !instagramUrl && !tiktokUrl) return null;

  return (
    <div className="bg-appointment-foreground rounded-lg p-4 border border-appointment-border mt-6">
      <h3 className="text-xl">Contato</h3>
      <hr className="border-divider-appointment" />

      <div className="flex items-center gap-8">
        {whatsAppUrl && (
          <Link
            href={withProtocol(whatsAppUrl)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/whatsapp.png" alt="WhatsApp" width={46} height={46} />
          </Link>
        )}
        {instagramUrl && (
          <Link
            href={withProtocol(instagramUrl)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/instagram.png"
              alt="Instagram"
              width={40}
              height={40}
            />
          </Link>
        )}
        {facebookUrl && (
          <Link
            href={withProtocol(facebookUrl)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/facebook.png" alt="Facebook" width={40} height={40} />
          </Link>
        )}
        {tiktokUrl && (
          <Link
            href={withProtocol(tiktokUrl)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/tiktok.webp"
              alt="TikTok"
              width={40}
              height={50}
              className="w-auto h-10"
            />
          </Link>
        )}
      </div>
    </div>
  );
}
