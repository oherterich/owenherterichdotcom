import type { Metadata } from "next";
import "./globals.scss";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
