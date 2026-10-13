import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teen Fiesta — RED ROOM",
  description:
    "Teen Fiesta RED ROOM returns to Mansion, Agra on 31 October 2026. Music by Fentatine.",
  applicationName: "Teen Fiesta",
  openGraph: {
    title: "Teen Fiesta — RED ROOM",
    description:
      "31 October 2026 · 5–9 PM · Mansion, Agra · Music by Fentatine.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#070707",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
