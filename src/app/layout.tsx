import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { dottedFont, paperCandy, geist, plexSans, plexMono } from "@/fonts/font";

import "./globals.css";
import { cn } from "@/lib/cn";



export const metadata: Metadata = {
  title: "jurno",
  description: "A modern journaling application for capturing and organizing your thoughts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(plexSans.variable, plexMono.variable, dottedFont.variable, paperCandy.variable, geist.variable)}>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
