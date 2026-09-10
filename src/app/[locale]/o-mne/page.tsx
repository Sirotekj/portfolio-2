import type { Metadata } from 'next';

import { getAboutPhotoSrc } from '@/lib/about/images';
import { localizeAboutPageData } from '@/lib/about/localize';
import { getAboutPageData, splitAboutIntro } from '@/lib/about/queries';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { buildPageMetadata } from '@/lib/site-settings/metadata';

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : 'cs';
  const messages = getMessages(locale);
  const data = await getAboutPageData();
  const intro = localizeAboutPageData(data, locale).intro.trim();

  return buildPageMetadata(locale, {
    title: messages.nav.about,
    description: intro || undefined,
    ogImage: data.aboutPage.photo.trim() || undefined,
  });
}

function LevelDots({ level }: { level: number }) {
  return (
    <span className="ml-2 truncate">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={`skill-circle ${index < level ? 'skill-circle-full' : ''}`}
        />
      ))}
    </span>
  );
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : 'cs';
  const messages = getMessages(locale);
  const data = await getAboutPageData();
  const localized = localizeAboutPageData(data, locale);
  const introParagraphs = splitAboutIntro(localized.intro);
  const photoSrc = getAboutPhotoSrc(data.aboutPage.photo);

  return (
    <section>
      <div className="container my-xlarge">
        <div className="after:clear-both after:content-[''] after:block">
          <div className="mb-medium mr-large w-full overflow-hidden rounded-xl shadow-xl sm:w-2/5 sm:float-left md:w-1/3">
            <picture>
              <img
                src={photoSrc}
                alt={messages.about.photoAlt}
                className="h-auto w-full"
              />
            </picture>
          </div>
          {introParagraphs.length > 0 ? (
            <div className="space-y-4">
              {introParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p className="text-light">{messages.about.empty.intro}</p>
          )}
        </div>
      </div>

      <div className="container my-xlarge">
        <div className="mb-12 grid grid-cols-1 gap-4 rounded-xl border border-border px-large pb-large shadow-xl lg:grid-cols-2">
          <div className="col-span-1">
            <h2>{messages.about.sections.skills}</h2>
            {localized.skills.length > 0 ? (
              <ul>
                {localized.skills.map((skill) => (
                  <li key={skill.id}>
                    {skill.displayName}
                    <LevelDots level={skill.level} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-light">{messages.about.empty.skills}</p>
            )}

            <h2>{messages.about.sections.education}</h2>
            {localized.education.length > 0 ? (
              <ul>
                {[...localized.education].reverse().map((education) => (
                  <li key={education.id}>
                    <b>{education.years}</b> - {education.displaySchool}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-light">{messages.about.empty.education}</p>
            )}

            <h2>{messages.about.sections.languages}</h2>
            {localized.languages.length > 0 ? (
              <ul>
                {localized.languages.map((language) => (
                  <li key={language.id}>
                    {language.displayName}
                    <LevelDots level={language.level} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-light">{messages.about.empty.languages}</p>
            )}

            <h2>{messages.about.sections.hobbies}</h2>
            {localized.hobbies.length > 0 ? (
              <p>
                {localized.hobbies
                  .map((hobby) => hobby.displayName)
                  .join(', ')}
              </p>
            ) : (
              <p className="text-light">{messages.about.empty.hobbies}</p>
            )}
          </div>

          <div className="col-span-1">
            <h2>{messages.about.sections.jobs}</h2>
            {localized.jobs.length > 0 ? (
              <ul>
                {[...localized.jobs].reverse().map((job) => (
                  <li key={job.id} className="whitespace-pre-line">
                    <b>{job.years}</b> - {job.displayDescription}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-light">{messages.about.empty.jobs}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
