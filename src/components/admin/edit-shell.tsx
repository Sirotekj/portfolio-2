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
    <div className="admin-shell">
      <header className="admin-shell__header">
        <div className="admin-shell__header-inner">
          <div>
            <p className="admin-shell__eyebrow">Administrace</p>
            <h1 className="admin-shell__title">{title}</h1>
            {description ? (
              <p className="admin-shell__desc">{description}</p>
            ) : null}
          </div>

          <div className="admin-shell__toolbar">
            <Link href="/edit" className="admin-shell__link">
              Přehled
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="admin-logout-btn">
                Odhlásit se
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="admin-shell__layout">
        <aside>
          <nav className="admin-nav">
            {editSections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="admin-nav__link"
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
