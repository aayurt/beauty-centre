"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface StaffMember {
  id: number;
  name: string;
  role: string | null;
  bio: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminStaffPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/staff?activeOnly=false");
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        if (!cancelled) setStaff(json.data);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load staff",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    try {
      const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setStaff((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete staff");
    }
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
          <h1 className="font-serif text-2xl">Staff</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {staff.length} member{staff.length !== 1 && "s"}
          </p>
        </div>
        <Button onClick={() => router.push("/admin/staff/new")}>
          <Plus className="size-4" />
          Add Member
        </Button>
      </div>

      {staff.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <Users className="size-8 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-lg font-medium">No staff yet</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Add your first team member to get started.
          </p>
          <Button onClick={() => router.push("/admin/staff/new")}>
            <Plus className="size-4" />
            Add Member
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((member) => (
            <div
              key={member.id}
              className="overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 transition-shadow hover:shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-muted">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="size-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Users className="size-12 text-muted-foreground/40" />
                  </div>
                )}
                {!member.isActive && (
                  <Badge
                    variant="secondary"
                    className="absolute right-2 top-2"
                  >
                    Inactive
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <h3 className="truncate text-base font-medium">
                  {member.name}
                </h3>
                {member.role && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {member.role}
                  </p>
                )}
                {member.bio && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {member.bio}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <span className="text-xs text-muted-foreground">
                    Order: {member.displayOrder}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`/admin/staff/${member.id}`)
                      }
                      title="Edit staff"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(member.id)}
                      title="Delete staff"
                      className="hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
