import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PIDEC 1.0 — University of Lagos Engineering Society",
    template: "%s · PIDEC 1.0",
  },
  description:
    "The Prototype Inter-Departmental Engineering Challenge. Ten engineering departments, three stages, one platform — operated by the ULES Competitions & Technical Team.",
  applicationName: "PIDEC 1.0",
  authors: [{ name: "ULES Competitions & Technical Team" }],
  keywords: [
    "PIDEC",
    "PIDEC 1.0",
    "ULES",
    "University of Lagos",
    "UNILAG Engineering",
    "engineering competition",
    "student engineering challenge",
    "Nigerian engineering",
  ],
  openGraph: {
    type: "website",
    siteName: "PIDEC 1.0",
    title: "PIDEC 1.0 — University of Lagos Engineering Society",
    description:
      "The Prototype Inter-Departmental Engineering Challenge. Ten departments, three stages, one chance to represent your discipline.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PIDEC 1.0",
    description:
      "Proving Innovation, Design, and Engineering Competence. ULES PIDEC 1.0.",
  },
};

import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
