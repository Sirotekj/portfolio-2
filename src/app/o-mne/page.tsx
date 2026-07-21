import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'O mně',
};

export default function AboutPage() {
  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-tight">O mně</h1>
      <p className="mt-4 max-w-2xl text-zinc-600">
        Krátké představení, zkušenosti a dovednosti.
      </p>
    </section>
  );
}
