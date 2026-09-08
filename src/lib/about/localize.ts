import type { Locale } from '@/i18n/config';
import type {
  AboutEditorData,
  AboutPageView,
  EducationView,
  HobbyView,
  JobExperienceView,
  LanguageView,
  SkillView,
} from '@/types/types';

function pickLocalized(
  primary: string,
  localized: string | null | undefined,
  locale: Locale,
): string {
  if (locale === 'en' && localized?.trim()) {
    return localized.trim();
  }

  return primary;
}

export function getLocalizedIntro(aboutPage: AboutPageView, locale: Locale): string {
  return pickLocalized(aboutPage.intro, aboutPage.introEn, locale);
}

export function getLocalizedHobbyName(hobby: HobbyView, locale: Locale): string {
  return pickLocalized(hobby.name, hobby.nameEn, locale);
}

export function getLocalizedSkillName(skill: SkillView, locale: Locale): string {
  return pickLocalized(skill.name, skill.nameEn, locale);
}

export function getLocalizedLanguageName(
  language: LanguageView,
  locale: Locale,
): string {
  return pickLocalized(language.name, language.nameEn, locale);
}

export function getLocalizedSchool(
  education: EducationView,
  locale: Locale,
): string {
  return pickLocalized(education.school, education.schoolEn, locale);
}

export function getLocalizedJobDescription(
  job: JobExperienceView,
  locale: Locale,
): string {
  return pickLocalized(job.description, job.descriptionEn, locale);
}

export function localizeAboutPageData(
  data: AboutEditorData,
  locale: Locale,
): {
  intro: string;
  hobbies: Array<HobbyView & { displayName: string }>;
  skills: Array<SkillView & { displayName: string }>;
  languages: Array<LanguageView & { displayName: string }>;
  education: Array<EducationView & { displaySchool: string }>;
  jobs: Array<JobExperienceView & { displayDescription: string }>;
} {
  return {
    intro: getLocalizedIntro(data.aboutPage, locale),
    hobbies: data.hobbies.map((hobby) => ({
      ...hobby,
      displayName: getLocalizedHobbyName(hobby, locale),
    })),
    skills: data.skills.map((skill) => ({
      ...skill,
      displayName: getLocalizedSkillName(skill, locale),
    })),
    languages: data.languages.map((language) => ({
      ...language,
      displayName: getLocalizedLanguageName(language, locale),
    })),
    education: data.education.map((item) => ({
      ...item,
      displaySchool: getLocalizedSchool(item, locale),
    })),
    jobs: data.jobs.map((job) => ({
      ...job,
      displayDescription: getLocalizedJobDescription(job, locale),
    })),
  };
}
