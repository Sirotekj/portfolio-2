'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import {
  getProjectImageSrc,
  hasProjectImageDimensions,
} from '@/lib/portfolio/images';
import { getProjectLocalizedTitle } from '@/lib/portfolio/localize';
import type { Categories, ProjectView } from '@/types/types';

const CATEGORY_LABELS: Record<Categories, string> = {
  print: 'print',
  digital: 'digital',
  personal: 'personal',
  logo: 'logo',
};

const CATEGORY_KEYS: Array<Categories | 'vse'> = [
  'print',
  'digital',
  'personal',
  'logo',
  'vse',
];

type PortfolioProps = {
  projects: ProjectView[];
  locale: Locale;
};

const LOADING_IMAGE = '/loading.png';

function ProjectImageLoader() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
      {/* eslint-disable-next-line @next/next/no-img-element -- animovaný placeholder z public/ */}
      <img
        src={LOADING_IMAGE}
        alt=""
        aria-hidden
        className="h-10 w-10 animate-spin"
      />
    </div>
  );
}

function ProjectImage({
  project,
  locale,
}: {
  project: ProjectView;
  locale: Locale;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const src = getProjectImageSrc(project);
  const title = getProjectLocalizedTitle(project, locale);
  const showLoader = !loaded && !failed;

  const imageClassName = `transition-opacity duration-300 ${
    loaded ? 'opacity-100' : 'opacity-0'
  }`;

  if (hasProjectImageDimensions(project)) {
    return (
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: `${project.imageWidth} / ${project.imageHeight}`,
        }}
      >
        {showLoader ? <ProjectImageLoader /> : null}
        <Image
          src={src}
          alt={title}
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover ${imageClassName}`}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-48">
      {showLoader ? <ProjectImageLoader /> : null}
      <Image
        src={src}
        alt={title}
        width={0}
        height={0}
        loading="lazy"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className={`h-auto w-full ${imageClassName}`}
        style={{ width: '100%', height: 'auto' }}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function Portfolio({ projects, locale }: PortfolioProps) {
  const [category, setCategory] = useState<Categories | 'vse'>('vse');
  const messages = getMessages(locale);

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
          {CATEGORY_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                className={`category-button ${category === key && 'active'}`}
                onClick={() => setCategory(key)}
              >
                {key === 'vse'
                  ? messages.portfolio.categories.all
                  : CATEGORY_LABELS[key]}
              </button>
            ))}
        </div>
      </div>

      <div className="mx-auto my-large container">
        {filteredProjects.length > 0 ? (
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
        ) : (
          <p className="text-center text-light">
            {messages.portfolio.empty.projects}
          </p>
        )}
      </div>
    </>
  );
}
