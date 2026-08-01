import type { Categories } from '@/types/types';

const PortfolioUvod = () => {
  return (
    <>
      Vítejte,
      <br />
      jsem grafička z Prahy s mnohaletou externí i interní praxí. Zabývám se
      tiskovou, webovou grafikou, logotypy a animací. Kromě toho zvládnu
      copywriting, jsem rychlá, spolehlivá a trpělivá. Užijte si prohlídku
      portfolia.
    </>
  );
};

const portfolio = { uvod: <PortfolioUvod /> };

export const getPortfolio = () => {
  return portfolio;
};

const projects = [
  {
    title: 'logo-agreFlex',
    image: 'logo-agreFlex',
    gallery: [''],
    description: '',
    category: '',
  },
  {
    title: 'Logo a název firmy vyrábějící medaile a trofeje',
    image: 'logo-a-nazev-firmy-vyrabejici-medaile-a-trofeje',
    gallery: [''],
    description: '',
    category: '',
  },
  {
    title: 'Logo pro Vinařské potřeby BS',
    image: 'logo-pro-vinarské-potreby-bs',
    gallery: [''],
    description: '',
    category: '',
  },
  {
    title: 'Logo architektonické firmy a architekta',
    image: 'logo-architektonicke-firmy-a-architekta',
    gallery: [''],
    description: '',
    category: '',
  },
  {
    title: 'Modelování z hlíny',
    image: 'modelovani-z-hliny',
    gallery: [''],
    description: '',
    category: 'personal',
  },
  {
    title: 'Grafika pro web a sociální sítě ADHDospělí',
    image: 'grafika-pro-web-a-socialni-site-adhddospeli',
    gallery: [''],
    description: '',
    category: 'digital',
  },
  {
    title: 'Leták - leporelo pro Magical Prague',
    image: 'letak---leporelo-pro-magical-prague',
    gallery: [''],
    description: '',
    category: 'print',
  },
  { title: '', image: '', gallery: [''], description: '', category: '' },
  { title: '', image: '', gallery: [''], description: '', category: '' },
  { title: '', image: '', gallery: [''], description: '', category: '' },
  { title: '', image: '', gallery: [''], description: '', category: '' },
  { title: '', image: '', gallery: [''], description: '', category: '' },
  { title: '', image: '', gallery: [''], description: '', category: '' },
  { title: '', image: '', gallery: [''], description: '', category: '' },
  { title: '', image: '', gallery: [''], description: '', category: '' },
];
export const getAllProjects = () => {
  return projects;
};
export const getCategoryProjects = (category: Categories) => {
  return projects.filter((project) => project.category === category);
};
