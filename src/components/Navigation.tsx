'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Portfolio' },
  { href: '/o-mne', label: 'O mně' },
  { href: '/blog', label: 'Blog' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {navItems.map(({ href, label }) => {
        const isActive =
          href === '/'
            ? pathname === '/'
            : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 text-xl font-medium transition-colors ${
              isActive
                ? 'bg-background text-primary'
                : 'text-foreground hover:text-primary'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
