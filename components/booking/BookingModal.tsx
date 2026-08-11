"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Service {
  id: number;
  title: string;
  category: string;
  duration: string;
  price: string;
  description: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  hair: "Hair Care",
  facials: "Facials & Skin",
  nails: "Nails & Lash",
  massage: "Massage & Spa",
  bridal: "Bridal Packages",
};

const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
];

const STEPS = ["Service", "Date & Time", "Details"];

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 320 : -320, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -320 : 320, opacity: 0 }),
};

export function BookingModal({
  open,
  onOpenChange,
  preselectedService,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedService?: string;
}) {
  const [services, setServices] = useState<Service[]>([]);
  const [step, setStep] = useState(preselectedService ? 1 : 0);
  const [direction, setDirection] = useState(1);
  const [selectedService, setSelectedService] = useState<string>(preselectedService ?? "");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const selectedServiceData = useMemo(
    () => services.find((s) => s.title === selectedService),
    [services, selectedService],
  );

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/services");
        const json = await res.json();
        if (!cancelled) {
          setServices(json.data || []);
        }
      } catch {
        // non-fatal
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const groupedServices = useMemo(() => {
    const groups: { category: string; items: Service[] }[] = [];
    for (const svc of services) {
      let group = groups.find((g) => g.category === svc.category);
      if (!group) {
        group = { category: svc.category, items: [] };
        groups.push(group);
      }
      group.items.push(svc);
    }
    return groups;
  }, [services]);

  const canNext =
    step === 0
      ? selectedService.length > 0
      : step === 1
        ? selectedDate.length > 0 && selectedTime.length > 0
        : step === 2
          ? name.trim().length > 0 && phone.trim().length > 0
          : true;

  const goNext = () => {
    if (!canNext) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      setError("Please fill in your name and phone number.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          service: selectedService,
          preferredDate: selectedDate,
          preferredTime: selectedTime,
          message: [
            email ? `Email: ${email}` : null,
            notes ? `Notes: ${notes}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        setStep(STEPS.length - 1);
        setDirection(1);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDialogClose = useCallback(
    (next: boolean) => {
      onOpenChange(next);
    },
    [onOpenChange],
  );

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const formatDate = (iso: string) => {
    if (!iso) return "";
    const d = new Date(`${iso}T00:00:00`);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose} modal>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Book an Appointment
          </DialogTitle>
          <DialogDescription>
            {STEPS[step]} — step {step + 1} of {STEPS.length}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="flex size-16 items-center justify-center rounded-full bg-amber-primary/10"
            >
              <Check className="size-8 text-amber-primary" />
            </motion.div>
            <div>
              <h3 className="font-serif text-xl font-bold text-foreground">
                Booking Request Received!
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Thank you, {name || "friend"}! We&apos;ve received your request
                for {selectedService} on {formatDate(selectedDate)} at{" "}
                {selectedTime}. Our team will contact you shortly to confirm.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Step indicator */}
            <div className="flex items-center gap-1.5">
              {STEPS.map((label, i) => (
                <div
                  key={label}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className={cn(
                      "h-1 w-full rounded-full transition-colors",
                      i <= step ? "bg-amber-primary" : "bg-neutral-200 dark:bg-neutral-700",
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium uppercase tracking-wider",
                      i === step
                        ? "text-amber-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="min-h-[280px] flex-1 overflow-y-auto pr-1">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {/* Step 1: Service */}
              {step === 0 && (
                <div className="space-y-4">
                  {groupedServices.length === 0 && (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      Loading services…
                    </p>
                  )}
                  {groupedServices.map((group) => (
                    <div key={group.category}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {CATEGORY_LABELS[group.category] ?? group.category}
                      </p>
                      <div className="grid gap-2">
                        {group.items.map((svc) => (
                          <button
                            key={svc.id}
                            type="button"
                            onClick={() => setSelectedService(svc.title)}
                            className={cn(
                              "flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition-all",
                              selectedService === svc.title
                                ? "border-amber-primary bg-amber-50 dark:bg-amber-500/10 ring-1 ring-amber-primary"
                                : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600",
                            )}
                          >
                            <span className="flex flex-col">
                              <span className="text-sm font-medium">{svc.title}</span>
                              <span className="text-xs text-muted-foreground">
                                {svc.duration}
                              </span>
                            </span>
                            <span className="flex items-center gap-2">
                              {selectedService === svc.title && (
                                <Check className="size-4 text-amber-primary" />
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 2: Date & Time */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <Label className="mb-2 flex items-center gap-1.5">
                      <CalendarDays className="size-4" />
                      Select a Date
                    </Label>
                    <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                      {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <span
                          key={i}
                          className="py-1 font-medium text-muted-foreground"
                        >
                          {d}
                        </span>
                      ))}
                      {next7Days().map((day, i) => {
                        const iso = toISODate(day);
                        const isSelected = selectedDate === iso;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedDate(iso)}
                            className={cn(
                              "rounded-lg py-2 text-sm transition-all",
                              isSelected
                                ? "bg-amber-primary text-white font-semibold"
                                : "text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800",
                            )}
                          >
                            {day.getDate()}
                          </button>
                        );
                      })}
                    </div>
                    {selectedDate && (
                      <p className="mt-2 text-sm font-medium text-amber-primary">
                        {formatDate(selectedDate)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="mb-2 flex items-center gap-1.5">
                      <Clock className="size-4" />
                      Select a Time
                    </Label>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={cn(
                            "rounded-lg border px-2 py-2 text-xs font-medium transition-all",
                            selectedTime === slot
                              ? "border-amber-primary bg-amber-primary text-white"
                              : "border-neutral-200 text-foreground hover:border-amber-primary/50 dark:border-neutral-700",
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="bk-name">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="bk-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bk-phone">
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="bk-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98XXXXXXXX"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bk-email">Email (optional)</Label>
                      <Input
                        id="bk-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@example.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bk-notes">Special Notes (optional)</Label>
                      <textarea
                        id="bk-notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        placeholder="Any allergies, preferences, or requests…"
                        className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/50 resize-none"
                      />
                    </div>
                  </div>

                  {selectedServiceData && (
                    <div className="rounded-lg bg-neutral-50 dark:bg-neutral-800 p-3 text-sm">
                      <p className="font-medium">Summary</p>
                      <p className="mt-1 text-muted-foreground">
                        {selectedServiceData.title} · {selectedServiceData.duration}
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        {formatDate(selectedDate)} at {selectedTime}
                      </p>
                    </div>
                  )}

                  {error && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                      {error}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
            </div>
          </>
        )}

        <div className="flex shrink-0 items-center justify-between gap-3 border-t pt-4">
          {submitted ? (
            <Button
              variant="default"
              className="ml-auto rounded-full"
              onClick={handleCancel}
            >
              Done
            </Button>
          ) : (
            <>
          <Button
            variant="ghost"
            onClick={step === 0 ? handleCancel : goBack}
            disabled={submitting}
          >
            {step === 0 ? "Cancel" : (
              <>
                <ChevronLeft className="size-4" />
                Back
              </>
            )}
          </Button>

          {step < STEPS.length - 1 ? (
            <Button onClick={goNext} disabled={!canNext || submitting}>
              Next
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canNext || submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Confirm Booking
                </>
              )}
            </Button>
          )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function next7Days(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
