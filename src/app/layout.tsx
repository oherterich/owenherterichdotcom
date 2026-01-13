import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-quicksand",
});

import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Owen Herterich",
  description: "Personal website of Owen Herterich",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={quicksand.variable}>
      <SpeedInsights />
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
