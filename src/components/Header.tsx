import Link from 'next/link';
import Navigation from './navigation';

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/75 bg-opacity-50 backdrop-blur-sm">
      <div className="container flex h-16 justify-between items-center gap-8 px-6">
        <Link
          href="/"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-xl font-semibold text-foreground"
          aria-label="Domů"
        >
          Logo
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
