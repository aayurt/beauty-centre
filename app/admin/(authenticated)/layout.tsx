import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import AdminShell from "@/components/layout/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthed = await verifySession();

  if (!isAuthed) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
