import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import AnimationProvider from "@/components/animations/AnimationProvider";
import ScrollProgressBar from "@/components/animations/ScrollProgressBar";
import { CompanyProvider } from "@/lib/company-context";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "K & S Beauty Centre | Hair, Facials & Massage",
  description: "Experience luxury beauty treatments at K & S Beauty Centre. Expert hair styling, rejuvenating facials, and relaxing massages in a serene atmosphere.",
  keywords: ["beauty centre", "hair salon", "facials", "massage", "beauty treatments", "K & S Beauty"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AnimationProvider>
            <CompanyProvider>
              <ScrollProgressBar />
              {children}
              <Toaster />
            </CompanyProvider>
          </AnimationProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.classList.add('preload');
              document.addEventListener('DOMContentLoaded', () => {
                requestAnimationFrame(() => {
                  document.documentElement.classList.remove('preload');
                });
              });
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}