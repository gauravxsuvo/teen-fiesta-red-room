import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://teen-fiesta.goldenbow256.chatgpt.site"),
  title: "Teen Fiesta — A Night in Red",
  description:
    "Step into the Teen Fiesta × etc campaign: red light, close rooms, and moments made for the music.",
  applicationName: "Teen Fiesta",
  openGraph: {
    title: "Teen Fiesta — A Night in Red",
    description:
      "A campaign told in red light, close rooms, and moments made for the music.",
    type: "website",
    images: ["/media/hero-campaign.jpg"],
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
