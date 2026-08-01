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
    image: '',
    gallery: [''],
    description: '',
    category: '',
  },
  { title: '', image: '', gallery: [''], description: '', category: '' },
  { title: '', image: '', gallery: [''], description: '', category: '' },
  { title: '', image: '', gallery: [''], description: '', category: '' },
  { title: '', image: '', gallery: [''], description: '', category: '' },
  { title: '', image: '', gallery: [''], description: '', category: '' },
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
