"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";

interface OrgFormData {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  logo: string;
  instagram: string;
  facebook: string;
  x: string;
  socialEnabled: boolean;
  instagramEnabled: boolean;
  facebookEnabled: boolean;
  xEnabled: boolean;
}

const emptyForm: OrgFormData = {
  name: "",
  tagline: "",
  description: "",
  address: "",
  phone: "",
  email: "",
  hours: "",
  logo: "",
  instagram: "",
  facebook: "",
  x: "",
  socialEnabled: false,
  instagramEnabled: false,
  facebookEnabled: false,
  xEnabled: false,
};

export default function OrganizationPage() {
  const router = useRouter();
  const [form, setForm] = useState<OrgFormData>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/company-profile");
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        if (!cancelled && json.data) {
          const d = json.data;
          setForm({
            name: d.name || "",
            tagline: d.tagline || "",
            description: d.description || "",
            address: d.address || "",
            phone: d.phone || "",
            email: d.email || "",
            hours: d.hours || "",
            logo: d.logo || "",
            instagram: d.instagram || "",
            facebook: d.facebook || "",
            x: d.x || "",
            socialEnabled: d.socialEnabled ?? false,
            instagramEnabled: d.instagramEnabled ?? false,
            facebookEnabled: d.facebookEnabled ?? false,
            xEnabled: d.xEnabled ?? false,
          });
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/company-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function updateField<K extends keyof OrgFormData>(
    field: K,
    value: OrgFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
          <Building2 className="size-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-serif text-2xl">Organization</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your business details
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
          Organization details saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">
                  Business Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="text"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  type="text"
                  value={form.tagline}
                  onChange={(e) => updateField("tagline", e.target.value)}
                />
              </div>
              <div className="space-y-1.5 lg:col-span-2">
                <Label htmlFor="address">
                  Address <span className="text-destructive">*</span>
                </Label>
                <textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  required
                  rows={3}
                  className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-y dark:bg-input/30"
                />
              </div>
              <div className="space-y-1.5 lg:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                  className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-y dark:bg-input/30"
                />
              </div>
              <div className="space-y-1.5 lg:col-span-2">
                <Label htmlFor="hours">Opening Hours</Label>
                <textarea
                  id="hours"
                  value={form.hours}
                  onChange={(e) => updateField("hours", e.target.value)}
                  rows={3}
                  placeholder="Monday - Friday: 9:00 AM - 8:00 PM&#10;Saturday: 9:00 AM - 6:00 PM&#10;Sunday: 10:00 AM - 4:00 PM"
                  className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-y dark:bg-input/30"
                />
              </div>
              <div className="space-y-1.5">
                <ImageUploader
                  value={form.logo}
                  onChange={(url) => updateField("logo", url)}
                  label="Logo"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Social Media</CardTitle>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={form.socialEnabled}
                  onChange={(e) =>
                    updateField("socialEnabled", e.target.checked)
                  }
                  className="size-4 rounded border-input text-primary focus:ring-ring"
                />
                Show social links
              </label>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  Instagram
                  <input
                    type="checkbox"
                    checked={form.instagramEnabled}
                    onChange={(e) =>
                      updateField("instagramEnabled", e.target.checked)
                    }
                    className="size-3.5 rounded border-input text-primary focus:ring-ring"
                  />
                </Label>
                <Input
                  id="instagram"
                  type="text"
                  value={form.instagram}
                  onChange={(e) => updateField("instagram", e.target.value)}
                  placeholder="@ksbeautycentre"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="facebook" className="flex items-center gap-2">
                  Facebook
                  <input
                    type="checkbox"
                    checked={form.facebookEnabled}
                    onChange={(e) =>
                      updateField("facebookEnabled", e.target.checked)
                    }
                    className="size-3.5 rounded border-input text-primary focus:ring-ring"
                  />
                </Label>
                <Input
                  id="facebook"
                  type="text"
                  value={form.facebook}
                  onChange={(e) => updateField("facebook", e.target.value)}
                  placeholder="KSBeautyCentre"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="x" className="flex items-center gap-2">
                  X (Twitter)
                  <input
                    type="checkbox"
                    checked={form.xEnabled}
                    onChange={(e) =>
                      updateField("xEnabled", e.target.checked)
                    }
                    className="size-3.5 rounded border-input text-primary focus:ring-ring"
                  />
                </Label>
                <Input
                  id="x"
                  type="text"
                  value={form.x}
                  onChange={(e) => updateField("x", e.target.value)}
                  placeholder="@ksbeauty"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={saving || !form.name || !form.email || !form.address}
          >
            <Save className="size-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
