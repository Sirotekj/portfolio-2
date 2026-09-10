import type { Locale } from './config';

const messages = {
  cs: {
    nav: {
      portfolio: 'Portfolio',
      about: 'O mně',
      blog: 'Blog',
    },
    home: 'Domů',
    notFound: {
      title: 'Stránka nenalezena',
      description:
        'Omlouváme se, ale stránka, kterou hledáte, neexistuje nebo byla přesunuta.',
      back: 'Zpět na portfolio',
    },
    blog: {
      back: '← Zpět na blog',
      notFound: 'Článek nenalezen',
      empty: 'Nejsou zde žádné publikované články.',
    },
    portfolio: {
      empty: 'Nejsou zde žádné projekty.',
    },
    about: {
      photoAlt: 'Profilová fotografie',
      sections: {
        skills: 'Dovednosti',
        education: 'Vzdělání',
        languages: 'Jazyky',
        hobbies: 'Koníčky',
        jobs: 'Pracovní zkušenosti',
      },
      empty: {
        intro: 'Není zde žádný úvodní text.',
        skills: 'Nejsou zde žádné dovednosti.',
        education: 'Není zde žádné vzdělání.',
        languages: 'Nejsou zde žádné jazyky.',
        hobbies: 'Nejsou zde žádné koníčky.',
        jobs: 'Nejsou zde žádné pracovní zkušenosti.',
      },
    },
    footer: {
      contactHeader: 'Kontakt',
      formHeader: 'Kontaktní formulář',
      formNameLabel: 'Jméno',
      formEmailLabel: 'Váš mail',
      formMessageLabel: 'Zpráva',
      formSubmitLabel: 'Odeslat',
    },
    localeSwitch: 'EN',
  },
  en: {
    nav: {
      portfolio: 'Portfolio',
      about: 'About me',
      blog: 'Blog',
    },
    home: 'Home',
    notFound: {
      title: 'Page not found',
      description:
        'Sorry, the page you are looking for does not exist or has been moved.',
      back: 'Back to portfolio',
    },
    blog: {
      back: '← Back to blog',
      notFound: 'Article not found',
      empty: 'There are no published articles here.',
    },
    portfolio: {
      empty: 'There are no projects here.',
    },
    about: {
      photoAlt: 'Profile photo',
      sections: {
        skills: 'Skills',
        education: 'Education',
        languages: 'Languages',
        hobbies: 'Hobbies',
        jobs: 'Work experience',
      },
      empty: {
        intro: 'There is no introduction here.',
        skills: 'There are no skills here.',
        education: 'There is no education here.',
        languages: 'There are no languages here.',
        hobbies: 'There are no hobbies here.',
        jobs: 'There is no work experience here.',
      },
    },
    footer: {
      contactHeader: 'Contact',
      formHeader: 'Contact form',
      formNameLabel: 'Name',
      formEmailLabel: 'Your email',
      formMessageLabel: 'Message',
      formSubmitLabel: 'Send',
    },
    localeSwitch: 'CS',
  },
} as const;

export type Messages = (typeof messages)[Locale];

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
