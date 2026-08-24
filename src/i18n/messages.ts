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
    },
    localeSwitch: 'CS',
  },
} as const;

export type Messages = (typeof messages)[Locale];

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
