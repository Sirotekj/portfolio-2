'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

import type { Locale } from '@/i18n/config';
import {
  getProjectImageSrc,
  hasProjectImageDimensions,
} from '@/lib/portfolio/images';
import { getProjectLocalizedTitle } from '@/lib/portfolio/localize';
import type { Categories, ProjectView } from '@/types/types';

const CATEGORY_LABELS: Record<Categories | 'vse', string> = {
  print: 'print',
  digital: 'digital',
  personal: 'personal',
  logo: 'logo',
  vse: 'vše',
};

type PortfolioProps = {
  projects: ProjectView[];
  locale: Locale;
};

function ProjectImage({
  project,
  locale,
}: {
  project: ProjectView;
  locale: Locale;
}) {
  const src = getProjectImageSrc(project);
  const title = getProjectLocalizedTitle(project, locale);

  if (hasProjectImageDimensions(project)) {
    return (
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: `${project.imageWidth} / ${project.imageHeight}`,
        }}
      >
        <Image
          src={src}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={title}
      width={0}
      height={0}
      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      className="h-auto w-full"
      style={{ width: '100%', height: 'auto' }}
    />
  );
}

export default function Portfolio({ projects, locale }: PortfolioProps) {
  const [category, setCategory] = useState<Categories | 'vse'>('vse');

  const filteredProjects = useMemo(() => {
    const withImage = projects.filter((project) => project.image);

    if (category === 'vse') {
      return withImage;
    }

    return withImage.filter((project) => project.category === category);
  }, [category, projects]);

  return (
    <>
      <div className="mx-auto my-16 container">
        <div className="flex justify-center gap-4">
          {(Object.keys(CATEGORY_LABELS) as Array<Categories | 'vse'>).map(
            (key) => (
              <button
                key={key}
                type="button"
                className={`category-button ${category === key && 'active'}`}
                onClick={() => setCategory(key)}
              >
                {CATEGORY_LABELS[key]}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="mx-auto mt-large container">
        <ul className="columns-1 gap-x-medium sm:columns-2 lg:columns-3">
          {filteredProjects.map((project) => (
            <li
              key={project.id}
              className="mb-medium w-full break-inside-avoid overflow-hidden rounded-xl shadow-xl"
            >
              <ProjectImage project={project} locale={locale} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
