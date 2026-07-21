import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminPage() {
  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
      <p className="mt-4 max-w-2xl text-zinc-600">
        Administrace obsahu portfolia.
      </p>
    </section>
  );
}
