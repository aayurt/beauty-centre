"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  User,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

interface BookingInquiry {
  id: number;
  name: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  createdAt: string;
}

interface ContactEntry {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

type Tab = "bookings" | "messages";

export default function AdminBookingsPage() {
  const [tab, setTab] = useState<Tab>("bookings");
  const [inquiries, setInquiries] = useState<BookingInquiry[]>([]);
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadInquiries = useCallback(async () => {
    try {
      const [bookingsRes, contactsRes] = await Promise.all([
        fetch("/api/bookings", { cache: "no-store" }),
        fetch("/api/contact", { cache: "no-store" }),
      ]);
      const bookingsJson = await bookingsRes.json();
      const contactsJson = await contactsRes.json();

      if (!bookingsRes.ok || bookingsJson.error) {
        throw new Error(bookingsJson.error || "Failed to load bookings");
      }
      if (!contactsRes.ok || contactsJson.error) {
        throw new Error(contactsJson.error || "Failed to load messages");
      }

      setInquiries(bookingsJson.data ?? []);
      setContacts(contactsJson.data ?? []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadInquiries();
    } finally {
      setRefreshing(false);
    }
  }, [loadInquiries]);

  useEffect(() => {
    (async () => {
      await loadInquiries();
    })();

    const refresh = () => loadInquiries();
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [loadInquiries]);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl">Inquiries</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {tab === "bookings"
              ? `${inquiries.length} booking request${inquiries.length !== 1 && "s"}`
              : `${contacts.length} message${contacts.length !== 1 && "s"}`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList className="mb-6">
          <TabsTrigger value="bookings">Booking Requests</TabsTrigger>
          <TabsTrigger value="messages">Contact Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <div className="space-y-3">
            {inquiries.length === 0 ? (
              <Card className="p-12 text-center">
                <Calendar className="mx-auto mb-4 size-12 text-muted-foreground/40" />
                <h2 className="mb-2 text-lg font-medium">
                  No booking requests yet
                </h2>
                <p className="text-sm text-muted-foreground">
                  Booking inquiries from the website will appear here.
                </p>
              </Card>
            ) : (
              inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="rounded-xl bg-card p-5 text-card-foreground ring-1 ring-foreground/10 transition-shadow hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                          <User className="size-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">
                            {inquiry.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(inquiry.createdAt)} at{" "}
                            {formatTime(inquiry.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="ml-12 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="size-3.5 text-muted-foreground" />
                          {inquiry.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3.5 text-muted-foreground" />
                          {formatDate(inquiry.preferredDate)} at{" "}
                          {inquiry.preferredTime}
                        </span>
                        <Badge variant="secondary">{inquiry.service}</Badge>
                      </div>
                      {inquiry.message && (
                        <p className="ml-12 mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {inquiry.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <div className="space-y-3">
            {contacts.length === 0 ? (
              <Card className="p-12 text-center">
                <MessageSquare className="mx-auto mb-4 size-12 text-muted-foreground/40" />
                <h2 className="mb-2 text-lg font-medium">
                  No messages yet
                </h2>
                <p className="text-sm text-muted-foreground">
                  Contact form submissions will appear here.
                </p>
              </Card>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="rounded-xl bg-card p-5 text-card-foreground ring-1 ring-foreground/10 transition-shadow hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-info/10">
                          <Mail className="size-4 text-info" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">
                            {contact.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(contact.createdAt)} at{" "}
                            {formatTime(contact.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="ml-12 mb-1 text-sm">
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-primary hover:underline"
                        >
                          {contact.email}
                        </a>
                      </p>
                      <p className="ml-12 whitespace-pre-wrap text-sm text-muted-foreground">
                        {contact.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
