import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Timer } from "lucide-react";
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
  title: "SAAD GYM — Workout Tracker",
  description: "Train Hard. Stay Consistent. A personal day-by-day gym workout checklist.",
  applicationName: "SAAD GYM",
  appleWebApp: { capable: true, title: "SAAD GYM", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6 sm:pt-10">
          {children}
        </main>
        <footer className="mx-auto flex w-full max-w-3xl items-center justify-center gap-2 px-4 pt-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-center text-xs text-muted-foreground">
          <Timer className="size-3.5 shrink-0" aria-hidden />
          <p>Progress is saved on this device for the whole cycle. The warm-up resets after 4 hours.</p>
        </footer>
      </body>
    </html>
  );
}
