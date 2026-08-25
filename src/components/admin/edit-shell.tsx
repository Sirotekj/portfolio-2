import Link from 'next/link';

import { logoutAction } from '@/app/admin/actions';
import { editSections } from '@/lib/admin/sections';

type EditShellProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
};

export default function EditShell({
  children,
  title,
  description,
}: EditShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-sm text-light">Administrace</p>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description ? (
              <p className="mt-1 text-sm text-light">{description}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/edit"
              className="text-sm font-medium text-primary hover:underline"
            >
              Přehled
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                Odhlásit se
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-8 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="flex flex-col gap-1">
            {editSections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {section.title}
              </Link>
            ))}
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
