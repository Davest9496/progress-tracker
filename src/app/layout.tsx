import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JourneyTracker — Dave Ejezie",
  description:
    "Live dashboard tracking Dave's 40-day MSP IT certification sprint: MS-900, ITIL 4 Foundation, Homelab, and Driving Theory.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-[hsl(222,47%,5%)] via-[hsl(222,47%,8%)] to-[hsl(230,40%,6%)]">
          {children}
        </div>
      </body>
    </html>
  );
}
