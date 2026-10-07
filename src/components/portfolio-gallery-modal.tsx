'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { Swiper as SwiperInstance } from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import {
  getProjectGalleryImages,
  getProjectImagePath,
  getProjectMediaKind,
  getProjectVideoSrc,
} from '@/lib/portfolio/media';
import { getProjectImageSrc } from '@/lib/portfolio/images';
import { getProjectLocalizedTitle } from '@/lib/portfolio/localize';
import type { ProjectView } from '@/types/types';

type PortfolioGalleryModalProps = {
  projects: ProjectView[];
  initialIndex: number;
  locale: Locale;
  onClose: () => void;
};

const THUMB_SLIDE_WIDTH_PX = 100;

function syncThumbsSwiperLayout(
  swiper: SwiperInstance,
  activeSlideIndex: number,
  animate = false,
): void {
  if (swiper.destroyed || swiper.el.clientWidth <= 0) {
    return;
  }

  swiper.update();
  swiper.slideTo(activeSlideIndex, animate ? 280 : 0);
}

function ProjectSlideMedia({
  project,
  title,
}: {
  project: ProjectView;
  title: string;
}) {
  const mediaKind = getProjectMediaKind(project);

  if (mediaKind === 'video') {
    const videoSrc = getProjectVideoSrc(project);

    return (
      <div className="portfolio-modal__media portfolio-modal__media--video">
        <video
          src={videoSrc}
          autoPlay
          playsInline
          loop
          className="portfolio-modal__video"
          style={
            project.videoWidth && project.videoHeight
              ? {
                  aspectRatio: `${project.videoWidth} / ${project.videoHeight}`,
                }
              : undefined
          }
        />
      </div>
    );
  }

  if (mediaKind === 'gallery') {
    const images = getProjectGalleryImages(project);

    return (
      <div
        className="portfolio-modal__gallery"
        data-count={images.length}
      >
        {images.map((imagePath) => (
          <div key={imagePath} className="portfolio-modal__gallery-item">
            <Image
              src={getProjectImagePath(imagePath)}
              alt={title}
              width={960}
              height={720}
              className="portfolio-modal__gallery-image"
              sizes="(min-width: 1024px) 480px, 100vw"
            />
          </div>
        ))}
      </div>
    );
  }

  const imageSrc = getProjectImageSrc(project);

  return (
    <div className="portfolio-modal__media portfolio-modal__media--image">
      {project.imageWidth && project.imageHeight ? (
        <div
          className="portfolio-modal__image-frame"
          style={{
            aspectRatio: `${project.imageWidth} / ${project.imageHeight}`,
          }}
        >
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="portfolio-modal__image"
            sizes="(min-width: 1024px) 960px, 100vw"
            priority
          />
        </div>
      ) : (
        <Image
          src={imageSrc}
          alt={title}
          width={960}
          height={720}
          className="portfolio-modal__image portfolio-modal__image--fluid"
          sizes="(min-width: 1024px) 960px, 100vw"
          priority
        />
      )}
    </div>
  );
}

export default function PortfolioGalleryModal({
  projects,
  initialIndex,
  locale,
  onClose,
}: PortfolioGalleryModalProps) {
  const messages = getMessages(locale);
  const thumbsWrapRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(initialIndex);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (!thumbsSwiper || thumbsSwiper.destroyed) {
      return;
    }

    syncThumbsSwiperLayout(thumbsSwiper, activeIndex, true);
  }, [activeIndex, thumbsSwiper]);

  useEffect(() => {
    const wrap = thumbsWrapRef.current;

    if (!thumbsSwiper || !wrap) {
      return;
    }

    const sync = () => {
      syncThumbsSwiperLayout(thumbsSwiper, activeIndexRef.current, false);
    };

    sync();
    const resizeObserver = new ResizeObserver(sync);
    resizeObserver.observe(wrap);

    return () => {
      resizeObserver.disconnect();
    };
  }, [thumbsSwiper]);

  if (projects.length === 0) {
    return null;
  }

  const safeIndex = Math.min(Math.max(initialIndex, 0), projects.length - 1);

  return (
    <div
      className="portfolio-modal"
      role="dialog"
      aria-modal="true"
      aria-label={messages.portfolio.gallery.title}
    >
      <button
        type="button"
        className="portfolio-modal__close"
        onClick={onClose}
        aria-label={messages.portfolio.gallery.close}
      >
        ×
      </button>

      <p className="portfolio-modal__pagination" aria-live="polite">
        {activeIndex + 1} / {projects.length}
      </p>

      <div className="portfolio-modal__main">
        <Swiper
          key={`portfolio-main-${safeIndex}-${projects.length}`}
          className="portfolio-modal__swiper portfolio-modal__swiper--main"
          modules={[Navigation, Thumbs]}
          navigation
          initialSlide={safeIndex}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
            swiper.el
              .querySelectorAll('video')
              .forEach((video) => video.pause());
          }}
          spaceBetween={24}
        >
          {projects.map((project) => {
            const title = getProjectLocalizedTitle(project, locale);

            return (
              <SwiperSlide key={project.id} className="portfolio-modal__slide">
                <ProjectSlideMedia project={project} title={title} />
                <p className="portfolio-modal__title">{title}</p>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <div ref={thumbsWrapRef} className="portfolio-modal__thumbs-wrap">
        <Swiper
          key={`portfolio-thumbs-${projects.map((project) => project.id).join('-')}`}
          className="portfolio-modal__swiper portfolio-modal__swiper--thumbs"
          onSwiper={(swiper) => {
            setThumbsSwiper(swiper);
            requestAnimationFrame(() => {
              syncThumbsSwiperLayout(swiper, safeIndex, false);
            });
          }}
          initialSlide={safeIndex}
          spaceBetween={8}
          slidesPerView="auto"
          centeredSlides
          centeredSlidesBounds={false}
          watchSlidesProgress
          slideToClickedSlide
          roundLengths
          observer
          observeParents
          resizeObserver
        >
          {projects.map((project) => {
            const title = getProjectLocalizedTitle(project, locale);
            const thumbSrc = getProjectImageSrc(project);

            return (
              <SwiperSlide
                key={project.id}
                className="portfolio-modal__thumb-slide"
                style={{ width: `${THUMB_SLIDE_WIDTH_PX}px`, flexShrink: 0 }}
                aria-label={title}
              >
                <div className="portfolio-modal__thumb">
                  <Image
                    src={thumbSrc}
                    alt=""
                    width={100}
                    height={80}
                    className="portfolio-modal__thumb-image"
                    sizes="100px"
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
