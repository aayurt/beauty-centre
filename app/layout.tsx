import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import AnimationProvider from "@/components/animations/AnimationProvider";
import ScrollProgressBar from "@/components/animations/ScrollProgressBar";
import { CompanyProvider } from "@/lib/company-context";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import ServiceWorkerUpdatePrompt from "@/components/ServiceWorkerUpdatePrompt";

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
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <AnimationProvider>
            <CompanyProvider>
              <ScrollProgressBar />
              {children}
              <ServiceWorkerUpdatePrompt />
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
                navigator.serviceWorker.getRegistrations().then(function(regs) {
                  for (var i = 0; i < regs.length; i++) {
                    regs[i].unregister();
                  }
                });
                if (window.caches) {
                  caches.keys().then(function(names) {
                    for (var i = 0; i < names.length; i++) {
                      caches.delete(names[i]);
                    }
                  });
                }
              }
            `,
          }}
        />
      </body>
    </html>
  );
}