"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface CompanyData {
  id: number;
  name: string;
  tagline: string | null;
  description: string | null;
  address: string;
  phone: string | null;
  email: string;
  hours: string | null;
  logo: string | null;
  instagram: string | null;
  facebook: string | null;
  x: string | null;
  socialEnabled: boolean;
  instagramEnabled: boolean;
  facebookEnabled: boolean;
  xEnabled: boolean;
}

const defaultCompany: CompanyData = {
  id: 0,
  name: "K & S Beauty Centre",
  tagline: "Crafting Beauty, One Client at a Time",
  description: null,
  address: "Jamal, Kathmandu 44600\nNepal",
  phone: "+977-1-4XXXXXX",
  email: "hello@ksbeautycentre.com",
  hours: "Monday - Friday: 9:00 AM - 8:00 PM\nSaturday: 9:00 AM - 6:00 PM\nSunday: 10:00 AM - 4:00 PM",
  logo: null,
  instagram: null,
  facebook: null,
  x: null,
  socialEnabled: false,
  instagramEnabled: false,
  facebookEnabled: false,
  xEnabled: false,
};

const CompanyContext = createContext<CompanyData>(defaultCompany);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompany] = useState<CompanyData>(defaultCompany);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/company-profile");
        const json = await res.json();
        if (json.data) setCompany(json.data);
      } catch {
        // fallback to defaults
      }
    })();
  }, []);

  return (
    <CompanyContext.Provider value={company}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  return useContext(CompanyContext);
}
