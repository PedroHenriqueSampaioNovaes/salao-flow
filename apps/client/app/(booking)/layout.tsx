import type { Metadata } from 'next';

export const metadata: Metadata = {
  other: {
    'color-scheme': 'dark',
  },
};

export default function BookingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
