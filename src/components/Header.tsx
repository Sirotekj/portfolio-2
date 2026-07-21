import Link from 'next/link';
import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl justify-between items-center gap-8 px-6">
        <Link
          href="/"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background text-xl font-semibold text-foreground"
          aria-label="Domů"
        >
          Logo
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
