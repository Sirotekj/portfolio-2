import type { Metadata } from 'next';

import {
  getAbout,
  getEducation,
  getHobbies,
  getJobs,
  getLanguages,
  getSkills,
} from '@/data/dummy-about';
import { getAboutPhotoSrc } from '@/lib/about/images';
import { localizeAboutPageData } from '@/lib/about/localize';
import { getAboutPageDataFromDb, splitAboutIntro } from '@/lib/about/queries';
import { isValidLocale, type Locale } from '@/i18n/config';

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'O mně',
};

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
  const dbData = await getAboutPageDataFromDb();

  if (dbData) {
    const localized = localizeAboutPageData(dbData, locale);
    const introParagraphs = splitAboutIntro(localized.intro);

    return (
      <section>
        <div className="container my-xlarge">
          <div className="after:clear-both after:content-[''] after:block">
            <div className="mb-medium mr-large w-full overflow-hidden rounded-xl shadow-xl sm:w-2/5 sm:float-left md:w-1/3">
              <picture>
                <img
                  src={getAboutPhotoSrc(dbData.aboutPage.photo)}
                  alt="About photo"
                  className="h-auto w-full"
                />
              </picture>
            </div>
            <div className="space-y-4">
              {introParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="container my-xlarge">
          <div className="mb-12 grid grid-cols-1 gap-4 rounded-xl border border-border px-large pb-large shadow-xl lg:grid-cols-2">
            <div className="col-span-1">
              <h2>Dovednosti</h2>
              <ul>
                {localized.skills.map((skill) => (
                  <li key={skill.id}>
                    {skill.displayName}
                    <LevelDots level={skill.level} />
                  </li>
                ))}
              </ul>

              <h2>Vzdělání</h2>
              <ul>
                {[...localized.education].reverse().map((education) => (
                  <li key={education.id}>
                    <b>{education.years}</b> - {education.displaySchool}
                  </li>
                ))}
              </ul>

              <h2>Jazyky</h2>
              <ul>
                {localized.languages.map((language) => (
                  <li key={language.id}>
                    {language.displayName}
                    <LevelDots level={language.level} />
                  </li>
                ))}
              </ul>

              <h2>Koníčky</h2>
              <p>
                {localized.hobbies.map((hobby) => hobby.displayName).join(', ')}
              </p>
            </div>

            <div className="col-span-1">
              <h2>Pracovní zkušenosti</h2>
              <ul>
                {[...localized.jobs].reverse().map((job) => (
                  <li key={job.id} className="whitespace-pre-line">
                    <b>{job.years}</b> - {job.displayDescription}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const textsAbout = getAbout();
  const textsSkills = getSkills();
  const textsEducation = getEducation();
  const textsLanguages = getLanguages();
  const textsHobbies = getHobbies();
  const textsJobs = getJobs();

  return (
    <section>
      <div className="container my-xlarge">
        <div className="after:clear-both after:content-[''] after:block">
          <div className="mb-medium mr-large w-full overflow-hidden rounded-xl shadow-xl sm:w-2/5 sm:float-left md:w-1/3">
            <picture>
              <img src={textsAbout.photo} alt="About photo" />
            </picture>
          </div>
          <div>{textsAbout.intro}</div>
        </div>
      </div>

      <div className="container my-xlarge">
        <div className="mb-12 grid grid-cols-1 gap-4 rounded-xl border border-border px-large pb-large shadow-xl lg:grid-cols-2">
          <div className="col-span-1">
            <h2>Dovednosti</h2>
            <ul>
              {textsSkills.map((skill) => (
                <li key={skill.skill}>
                  {skill.skill}
                  <LevelDots level={skill.level} />
                </li>
              ))}
            </ul>

            <h2>Vzdělání</h2>
            <ul>
              {[...textsEducation].reverse().map((education) => (
                <li key={education.school}>
                  <b>{education.years}</b> - {education.school}
                </li>
              ))}
            </ul>

            <h2>Jazyky</h2>
            <ul>
              {textsLanguages.map((language) => (
                <li key={language.language}>
                  {language.language}
                  <LevelDots level={language.level} />
                </li>
              ))}
            </ul>

            <h2>Koníčky</h2>
            <p>{textsHobbies}</p>
          </div>

          <div className="col-span-1">
            <h2>Pracovní zkušenosti</h2>
            <ul>
              {[...textsJobs].reverse().map((job) => (
                <li key={job.name} className="whitespace-pre-line">
                  <b>{job.years}</b> - {job.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
