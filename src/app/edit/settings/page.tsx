import type { Metadata } from 'next';

import EditShell from '@/components/admin/edit-shell';

export const metadata: Metadata = {
  title: 'Editace | Nastavení',
};

export default function EditSettingsPage() {
  return (
    <EditShell
      title="Nastavení webu"
      description="Kontaktní údaje a texty formuláře v patičce."
    >
      <div className="rounded-xl border border-dashed border-border p-6 text-light">
        <p>
          Editor nastavení zatím připravujeme. Po napojení na databázi zde
          půjde upravit kontakt a popisky formuláře.
        </p>
      </div>
    </EditShell>
  );
}
