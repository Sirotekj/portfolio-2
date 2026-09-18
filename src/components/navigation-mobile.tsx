'use client';

import { useState } from 'react';
import Link from 'next/link';

export type NavigationMobileItem = {
  href: string;
  label: string;
  isActive: boolean;
};

type NavigationMobileProps = {
  navItems: NavigationMobileItem[];
};

export default function NavigationMobile({ navItems }: NavigationMobileProps) {
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);

  return (
    <>
      <button
        id="burger"
        type="button"
        aria-expanded={mobileMenuOpened}
        aria-label={mobileMenuOpened ? 'Zavřít menu' : 'Otevřít menu'}
        onClick={() => setMobileMenuOpened((opened) => !opened)}
        className={`open-main-nav md:hidden ${mobileMenuOpened ? 'is-open' : ''}`}
      >
        <span className="burger"></span>
      </button>

      <div
        className={`mobile-menu md:hidden ${mobileMenuOpened ? 'is-open' : ''}`}
      >
        <ul className="mobile-menu__list">
          {navItems.map(({ href, label, isActive }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpened(false)}
              className="mobile-menu__link"
              data-active={isActive ? 'true' : 'false'}
            >
              {label}
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
}
