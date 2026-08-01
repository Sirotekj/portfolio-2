import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container my-xlarge text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="mt-medium text-3xl font-bold tracking-tight text-foreground">
        Stránka nenalezena
      </h1>
      <p className="mx-auto mt-small max-w-md text-light">
        Omlouváme se, ale stránka, kterou hledáte, neexistuje nebo byla
        přesunuta.
      </p>
      <Link
        href="/"
        className="mt-large inline-block rounded-md bg-primary px-large py-small text-background transition-opacity hover:opacity-90"
      >
        Zpět na portfolio
      </Link>
    </section>
  );
}
