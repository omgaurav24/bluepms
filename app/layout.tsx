/* app/layout.tsx */
import "./globals.css";
import { BackgroundGradientAnimation } from "@/components/ui/aurora-background";
import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
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

/** Mobile viewport + iOS safe-area support */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",      // use the whole screen, including under notches
  themeColor: "#0B1B34",     // your dark brand blue for browser UI
};
const nunito = Nunito_Sans({
  weight: ["700", "900"], // adjust as needed
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen h-full antialiased">
        <BackgroundGradientAnimation className="min-h-[100svh] w-full">
          {/* Safe-area padding so nothing sits under notches/home indicators */}
          <div
            className="min-h-[100svh] w-full"
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
              paddingLeft: "env(safe-area-inset-left)",
              paddingRight: "env(safe-area-inset-right)",
            }}
          >
            {children}
          </div>
        </BackgroundGradientAnimation>
      </body>
    </html>
  );
}