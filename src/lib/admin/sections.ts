export const editSections = [
  {
    href: '/edit/portfolio',
    title: 'Portfolio',
    description: 'Úvodní text a projekty na homepage',
    previewPath: '/cs',
  },
  {
    href: '/edit/about',
    title: 'O mně',
    description: 'Foto, text, dovednosti, vzdělání a zkušenosti',
    previewPath: '/cs/o-mne',
  },
  {
    href: '/edit/blog',
    title: 'Blog',
    description: 'Články a jejich obsah',
    previewPath: '/cs/blog',
  },
  {
    href: '/edit/settings',
    title: 'Nastavení webu',
    description: 'Kontakt a texty formuláře v patičce',
    previewPath: '/cs',
  },
] as const;

export type EditSection = (typeof editSections)[number];
