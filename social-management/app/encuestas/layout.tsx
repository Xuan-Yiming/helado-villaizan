import type { Metadata } from "next";
import "../globals.css";

import { inter } from "../ui/fonts";
import Header from './header'
import HeaderMobile from '@/app/ui/header/header-mobile';
import MarginWidthWrapper from '@/app/ui/page-wrapper/margin-width-wrapper';
import PageWrapper from '@/app/ui/page-wrapper/page-wrapper';
import { ErrorProvider } from "@/app/context/errorContext";
import ErrorPopup from "@/app/ui/error-popup";

export const metadata: Metadata = {
  title: "Encuesta",
  description: "Un formulario para recopilar información de los clientes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${inter}`}
      >
        <main className="flex-1 max-h-auto">
        <ErrorProvider>
          <Header />
              <PageWrapper>{children}</PageWrapper>

              <ErrorPopup /> {/* Add the popup component here */}
              </ErrorProvider>
          </main>
      </body>
    </html>
  );
}
