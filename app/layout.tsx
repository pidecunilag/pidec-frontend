import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";

import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { absoluteUrl, seo, siteUrl } from "@/lib/seo";

import "./globals.css";

const pidecSans = Plus_Jakarta_Sans({
  variable: "--font-pidec-sans",
  subsets: ["latin"],
});

const pidecDisplay = Space_Grotesk({
  variable: "--font-pidec-display",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: seo.title,
    template: "%s | PIDEC 1.0",
  },
  description: seo.description,
  applicationName: seo.name,
  authors: [{ name: seo.organizer }],
  creator: seo.organizer,
  publisher: seo.organizer,
  keywords: [
    "PIDEC",
    "PIDEC 1.0",
    "ULES",
    "University of Lagos Engineering Society",
    "University of Lagos",
    "UNILAG",
    "engineering competition",
    "inter departmental engineering challenge",
    "prototype engineering challenge",
    "student engineering challenge",
    "UNILAG engineering",
    "engineering for impact",
    "sustainable engineering",
  ],
  category: "education",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    siteName: seo.name,
    title: seo.title,
    description: seo.description,
    locale: "en_NG",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "PIDEC 1.0 engineering competition",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pidecSans.variable} ${pidecDisplay.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
