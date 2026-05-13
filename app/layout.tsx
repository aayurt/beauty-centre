import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

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
    >
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}