import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://logisticsstudio.com"),
  title: "Logistics Studio | Supply Chain Innovation & Solutions",
  description: "Technology solutions for transportation & logistics. EDI, API, AI, QA, BI for freight forwarders, 3PLs, carriers, and warehouses.",
  openGraph: {
    title: "Logistics Studio | Supply Chain Innovation & Solutions",
    description: "Technology solutions for transportation & logistics. EDI, API, AI, QA, BI for freight forwarders, 3PLs, carriers, and warehouses.",
    url: "https://logisticsstudio.com",
    siteName: "Logistics Studio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Logistics Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interTight.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
