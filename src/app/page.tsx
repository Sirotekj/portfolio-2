import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio',
};

export default function PortfolioPage() {
  return (
    <section>
      <div className="container">
        <h1 className="text-3xl font-semibold tracking-tight">Portfolio</h1>
        <p className="mt-4 max-w-2xl text-zinc-600">
          Zde budou prezentovány moje projekty a práce.
        </p>
      </div>
    </section>
  );
}
