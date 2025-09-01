/* app/layout.tsx */
import "./globals.css";
import { BackgroundGradientAnimation } from "@/components/ui/aurora-background";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BLUEPMS – AI-Powered Cloud Hotel Management Software",
  description:
    "BLUEPMS is a 100% cloud-based, AI-integrated property management system for hotels. Streamline front office, POS, housekeeping, inventory & more.",
  keywords: [
    "Hotel PMS",
    "Property Management Software",
    "AI PMS",
    "Cloud Hotel Software",
    "Hospitality Management System",
  ],
  metadataBase: new URL("https://bluepms.com"),
  alternates: {
    canonical: "https://bluepms.com",
  },
  openGraph: {
    title: "BLUEPMS – AI-Powered Cloud Hotel Management Software",
    description:
      "BLUEPMS is a 100% cloud-based, AI-integrated property management system for hotels. Streamline front office, POS, housekeeping, inventory & more.",
    url: "https://bluepms.com",
    siteName: "BLUEPMS",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BackgroundGradientAnimation className="min-h-screen w-full">
          {children}
        </BackgroundGradientAnimation>
      </body>
    </html>
  );
}