import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Header from '@/app/ui/header/header';
import HeaderMobile from '@/app/ui/header/header-mobile';
import MarginWidthWrapper from '@/app/ui/page-wrapper/margin-width-wrapper';
import PageWrapper from '@/app/ui/page-wrapper/page-wrapper';
import SideNav from '@/app/ui/sidenav/sidenav';
import NavigationBar from '@/app/ui/navegation-bar';

import ErrorPopup from '@/app/ui/error-popup';
import { ErrorProvider } from '@/app/context/errorContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Social Hub',
  description: 'Generated by create next app',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-white ${inter.className}`}>
      <ErrorProvider>
        <div className="flex">
          <SideNav />
          <main className="flex-1">
            <MarginWidthWrapper>
              <Header />
              <HeaderMobile />
              <NavigationBar />
              <PageWrapper>{children}</PageWrapper>
            </MarginWidthWrapper>
          </main>
        </div>
        <ErrorPopup /> {/* Add the popup component here */}
        </ErrorProvider>
      </body>
    </html>
  );
}
