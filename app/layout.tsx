import type { Metadata } from 'next';
import './globals.css';
import TravelBot from '@/components/travel-bot';

export const metadata: Metadata = {
  title: 'Nodebook Travels | Pakistan & International Holidays',
  description: 'Explore Pakistan destinations and international holiday packages with Nodebook Travels.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
        />
      </head>
      <body>
        {children}
        <TravelBot />
      </body>
    </html>
  );
}


