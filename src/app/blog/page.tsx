import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
};

export default function BlogPage() {
  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
      <p className="mt-4 max-w-2xl text-zinc-600">
        Články, poznámky a myšlenky z oblasti vývoje.
      </p>
    </section>
  );
}
