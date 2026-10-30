"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
import { BookingModal } from "./BookingModal";

interface BookingContextValue {
  openBooking: (service?: string) => void;
}

const BookingContext = createContext<BookingContextValue>({
  openBooking: () => {},
});

function UrlBookingSync({
  openBooking,
}: {
  openBooking: (service?: string) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("book") === "true") {
      const serviceParam = searchParams.get("service") || undefined;
      openBooking(serviceParam);
    }
  }, [searchParams, openBooking]);

  return null;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>();
  const [openCount, setOpenCount] = useState(0);

  const openBooking = useCallback((service?: string) => {
    setPreselectedService(service);
    setOpenCount((c) => c + 1);
    setIsOpen(true);
  }, []);

  const value = useMemo(
    () => ({ openBooking }),
    [openBooking],
  );

  return (
    <BookingContext.Provider value={value}>
      <Suspense fallback={null}>
        <UrlBookingSync openBooking={openBooking} />
      </Suspense>
      {children}
      <BookingModal
        key={openCount}
        open={isOpen}
        onOpenChange={setIsOpen}
        preselectedService={preselectedService}
      />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}
