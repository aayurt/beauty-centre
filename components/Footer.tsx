"use client"

import Link from "next/link"
import { useCompany } from "@/lib/company-context"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  const company = useCompany()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-900 text-neutral-100 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="font-serif text-3xl font-bold text-white">
              {company.name}
            </h3>
            <p className="mt-4 max-w-md leading-relaxed text-neutral-400">
              {company.description || "Where elegance meets expertise."}
            </p>
            {company.socialEnabled && (
              <div className="mt-6 flex gap-3">
                {company.instagramEnabled && company.instagram && (
                  <a
                    href={`https://instagram.com/${company.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-colors hover:bg-primary hover:text-white active:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                    aria-label="Instagram"
                  >
                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}
                {company.facebookEnabled && company.facebook && (
                  <a
                    href={`https://facebook.com/${company.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-colors hover:bg-primary hover:text-white active:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                    aria-label="Facebook"
                  >
                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {company.xEnabled && company.x && (
                  <a
                    href={`https://x.com/${company.x.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-colors hover:bg-primary hover:text-white active:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                    aria-label="X"
                  >
                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-neutral-300">
              Quick Links
            </h4>
            <ul className="mt-6 space-y-3">
              {[
                { label: "Home", href: "#home" },
                { label: "About Us", href: "#about" },
                { label: "Services", href: "#services" },
                { label: "Gallery", href: "#gallery" },
                { label: "Our Team", href: "#team" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-primary active:text-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50 outline-none rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-neutral-300">
              Contact Info
            </h4>
            <ul className="mt-6 space-y-3 text-sm text-neutral-400">
              {company.address.split("\n").map((line, i) => (
                <li key={i}>{line}</li>
              ))}
              {company.phone && (
                <li className="pt-2">
                  <a
                    href={`tel:${company.phone}`}
                    className="transition-colors hover:text-primary active:text-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50 outline-none rounded"
                  >
                    {company.phone}
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="transition-colors hover:text-primary active:text-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50 outline-none rounded"
                >
                  {company.email}
                </a>
              </li>
              {company.hours && (
                <li className="pt-2 whitespace-pre-line leading-relaxed">
                  {company.hours}
                </li>
              )}
            </ul>
          </div>
        </div>

        <Separator className="mb-10 mt-16 bg-neutral-800" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-neutral-500">
            &copy; {currentYear} {company.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-neutral-500">
            <Link
              href="#"
              className="transition-colors hover:text-primary active:text-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50 outline-none rounded"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-primary active:text-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50 outline-none rounded"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
