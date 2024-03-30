import { ReactNode } from "react";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Viewport } from "next";
import PlausibleProvider from "next-plausible";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const font = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const calcom = localFont({
  src: [
    {
      path: "../assets/fonts/CalSans-SemiBold.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-calcom",
});

export const viewport: Viewport = {
  // Will use the primary color of your theme to show a nice theme color in the URL bar of supported browsers
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1,
};

// This adds default SEO tags to all pages in our app.
// You can override them in each page passing params to getSOTags() function.
export const metadata = getSEOTags();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme={config.colors.theme} className={`${calcom.variable} ${font.variable} font-inter`}>
      {config.domainName && (
        <head>
          <PlausibleProvider domain={config.domainName} />
        </head>
      )}
      <body>
        {/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
        <ClientLayout>{children}</ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}
