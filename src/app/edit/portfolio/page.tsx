import type { Metadata } from 'next';

import EditShell from '@/components/admin/edit-shell';

export const metadata: Metadata = {
  title: 'Editace | Portfolio',
};

export default function EditPortfolioPage() {
  return (
    <EditShell
      title="Portfolio"
      description="Úvodní text a projekty zobrazené na homepage."
    >
      <div className="rounded-xl border border-dashed border-border p-6 text-light">
        <p>
          Editor portfolia zatím připravujeme. Po napojení na databázi zde
          půjde upravit úvodní text a jednotlivé projekty.
        </p>
      </div>
    </EditShell>
  );
}
