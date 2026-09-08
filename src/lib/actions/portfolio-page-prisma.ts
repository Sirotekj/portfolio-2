import type { PortfolioPageView } from '@/types/types';

import { prisma } from '@/lib/prisma';

const portfolioPageDefaults = {
  intro: '',
  introEn: null,
};

export async function getOrCreatePortfolioPage(): Promise<PortfolioPageView> {
  return prisma.portfolioPage.upsert({
    where: { id: 1 },
    create: { id: 1, ...portfolioPageDefaults },
    update: {},
  });
}

export async function updatePortfolioPage(data: {
  intro: string;
  introEn: string | null;
}): Promise<void> {
  await prisma.portfolioPage.upsert({
    where: { id: 1 },
    create: { id: 1, ...portfolioPageDefaults, ...data },
    update: data,
  });
}
