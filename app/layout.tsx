import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";

import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

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
  title: {
    default: "PIDEC 1.0 - University of Lagos Engineering Society",
    template: "%s | PIDEC 1.0",
  },
  description:
    "PIDEC is the Prototype Inter-Departmental Engineering Challenge by the University of Lagos Engineering Society, uniting bold engineering teams across three competitive stages.",
  applicationName: "PIDEC 1.0",
  authors: [{ name: "ULES Competitions & Technical Team" }],
  keywords: [
    "PIDEC",
    "PIDEC 1.0",
    "University of Lagos Engineering Society",
    "ULES",
    "engineering competition",
    "prototype challenge",
    "student engineering challenge",
    "UNILAG engineering",
  ],
  openGraph: {
    type: "website",
    siteName: "PIDEC 1.0",
    title: "PIDEC 1.0 - University of Lagos Engineering Society",
    description:
      "A brand-led digital home for the Prototype Inter-Departmental Engineering Challenge.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PIDEC 1.0",
    description: "Proving Innovation, Design, and Engineering Competence.",
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
