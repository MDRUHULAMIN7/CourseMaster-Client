import type { Metadata } from "next";
import AdminLayout from "./_components/AdminLayout";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin control panel",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <AdminLayout>{children}</AdminLayout>
  );
}