'use server';

import { revalidatePath } from 'next/cache';

import type { FormState } from '@/types/types';

import {
  getOrCreatePortfolioPage,
  updatePortfolioPage,
} from '@/lib/actions/portfolio-page-prisma';

function optionalText(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
}

function revalidatePortfolioPagePaths(): void {
  revalidatePath('/edit/portfolio');
  revalidatePath('/cs');
  revalidatePath('/en');
}

export async function savePortfolioPageAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const intro = String(formData.get('intro') ?? '').trim();
  const introEn = optionalText(formData.get('introEn'));

  if (!intro) {
    return { messages: [], errors: ['Vyplň úvodní text portfolia (CS).'] };
  }

  try {
    await updatePortfolioPage({ intro, introEn });
    revalidatePortfolioPagePaths();

    return { messages: ['Úvodní text portfolia byl uložen.'], errors: [] };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Uložení se nezdařilo.';

    return { messages: [], errors: [message] };
  }
}

export { getOrCreatePortfolioPage };
