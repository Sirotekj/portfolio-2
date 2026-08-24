import type { Metadata } from 'next';

import Portfolio from '@/components/portfolio';
import { getPortfolio } from '@/data/dummy-portfolio';

export const metadata: Metadata = {
  title: 'Portfolio',
};

export default function PortfolioPage() {
  const portfolio = getPortfolio();

  return (
    <section>
      <div className="mx-auto container">
        <p className="mt-4">{portfolio.uvod}</p>
      </div>

      <Portfolio />
    </section>
  );
}
