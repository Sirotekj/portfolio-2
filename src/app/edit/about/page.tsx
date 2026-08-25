import type { Metadata } from 'next';

import EditShell from '@/components/admin/edit-shell';

export const metadata: Metadata = {
  title: 'Editace | O mně',
};

export default function EditAboutPage() {
  return (
    <EditShell
      title="O mně"
      description="Obsah stránky O mně včetně dovedností a zkušeností."
    >
      <div className="rounded-xl border border-dashed border-border p-6 text-light">
        <p>
          Editor stránky O mně zatím připravujeme. Po napojení na databázi zde
          půjde upravit foto, text, dovednosti, vzdělání a pracovní zkušenosti.
        </p>
      </div>
    </EditShell>
  );
}
