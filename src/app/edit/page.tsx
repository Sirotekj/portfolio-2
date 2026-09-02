import type { Metadata } from 'next';
import Link from 'next/link';

import EditShell from '@/components/admin/edit-shell';
import { editSections } from '@/lib/admin/sections';

export const metadata: Metadata = {
  title: 'Editace obsahu',
};

export default function EditDashboardPage() {
  return (
    <EditShell
      title="Editace obsahu"
      description="Vyber sekci, kterou chceš upravit."
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {editSections.map((section) => (
          <li key={section.href}>
            <Link
              href={section.href}
              className="block h-full rounded-xl border border-border p-5 shadow-sm transition-colors hover:border-primary"
            >
              <h2 className="text-lg mt-0 font-semibold text-foreground">
                {section.title}
              </h2>
              <p className="mt-2 text-sm text-light">{section.description}</p>
              <p className="mt-4 text-sm font-medium text-primary">Upravit →</p>
            </Link>
          </li>
        ))}
      </ul>
    </EditShell>
  );
}
