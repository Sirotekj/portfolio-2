'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import PortfolioGalleryModal from '@/components/portfolio-gallery-modal';
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
    <div className="portfolio-image__loader">
      {/* eslint-disable-next-line @next/next/no-img-element -- animovaný placeholder z public/ */}
      <img
        src={LOADING_IMAGE}
        alt=""
        aria-hidden
        className="portfolio-image__spinner"
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

  const imageClassName = `portfolio-image__img ${
    loaded ? 'portfolio-image__img--loaded' : ''
  }`;

  if (hasProjectImageDimensions(project)) {
    return (
      <div
        className="portfolio-image"
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
          className={`${imageClassName} portfolio-image__img--cover`}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="portfolio-image portfolio-image--fluid">
      {showLoader ? <ProjectImageLoader /> : null}
      <Image
        src={src}
        alt={title}
        width={0}
        height={0}
        loading="lazy"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className={`${imageClassName} portfolio-image__img--fluid`}
        style={{ width: '100%', height: 'auto' }}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function Portfolio({ projects, locale }: PortfolioProps) {
  const [category, setCategory] = useState<Categories | 'vse'>('vse');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const messages = getMessages(locale);

  const filteredProjects = useMemo(() => {
    const withImage = projects.filter((project) => project.image);

    if (category === 'vse') {
      return withImage;
    }

    return withImage.filter((project) => project.category === category);
  }, [category, projects]);

  useEffect(() => {
    setSelectedIndex(null);
  }, [category]);

  return (
    <>
      <div className="portfolio-filters container">
        <div className="portfolio-filters__list">
          {CATEGORY_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className={`category-button ${category === key ? 'active' : ''}`}
              onClick={() => setCategory(key)}
            >
              {key === 'vse'
                ? messages.portfolio.categories.all
                : CATEGORY_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="portfolio-grid container">
        {filteredProjects.length > 0 ? (
          <ul className="portfolio-grid__columns">
            {filteredProjects.map((project, index) => (
              <li key={project.id} className="portfolio-grid__item">
                <button
                  type="button"
                  className="portfolio-grid__button"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={getProjectLocalizedTitle(project, locale)}
                >
                  <ProjectImage project={project} locale={locale} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="page-empty">{messages.portfolio.empty.projects}</p>
        )}
      </div>

      {selectedIndex !== null ? (
        <PortfolioGalleryModal
          projects={filteredProjects}
          initialIndex={selectedIndex}
          locale={locale}
          onClose={() => setSelectedIndex(null)}
        />
      ) : null}
    </>
  );
}
