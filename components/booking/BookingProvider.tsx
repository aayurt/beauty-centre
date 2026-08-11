"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { BookingModal } from "./BookingModal";

interface BookingContextValue {
  openBooking: (service?: string) => void;
}

const BookingContext = createContext<BookingContextValue>({
  openBooking: () => {},
});

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
