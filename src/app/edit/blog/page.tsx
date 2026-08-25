import type { Metadata } from 'next';

import EditShell from '@/components/admin/edit-shell';

export const metadata: Metadata = {
  title: 'Editace | Blog',
};

export default function EditBlogPage() {
  return (
    <EditShell
      title="Blog"
      description="Správa blogových článků."
    >
      <div className="rounded-xl border border-dashed border-border p-6 text-light">
        <p>
          Editor blogu zatím připravujeme. Po napojení na databázi zde půjde
          přidávat, upravovat a mazat články.
        </p>
      </div>
    </EditShell>
  );
}
