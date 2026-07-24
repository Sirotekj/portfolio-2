const skills = [
  {
    skill: 'Adobe Photoshop',
    level: 5,
  },
  {
    skill: 'Adobe Illustrator',
    level: 4,
  },
  {
    skill: 'Adobe InDesign',
    level: 5,
  },
  {
    skill: 'QuarkXPress',
    level: 3,
  },
  {
    skill: 'Corel DRAW!',
    level: 4,
  },
  {
    skill: 'Adobe Animate',
    level: 5,
  },
  {
    skill: 'Adobe Dreamweaver',
    level: 3,
  },
  {
    skill: 'Adobe Premiere Pro',
    level: 4,
  },
  {
    skill: 'Adobe After Effects',
    level: 2,
  },
  {
    skill: 'Adobe Audition',
    level: 3,
  },
  {
    skill: 'Cinema 4D',
    level: 3,
  },
  {
    skill: 'DTP operátor',
    level: 5,
  },
  {
    skill: 'UI/UX Design',
    level: 4,
  },
  {
    skill: 'Ofsetový tisk',
    level: 5,
  },
  {
    skill: 'Grafik',
    level: 5,
  },
];

export const getSkills = () => {
  return skills;
};

const languages = [
  {
    language: 'Čeština',
    level: 5,
  },
  {
    language: 'English',
    level: 4,
  },
  {
    language: 'Slovenčina',
    level: 1,
  },
  {
    language: 'Němčina',
    level: 2,
  },
];

const education = [
  {
    years: '2002 – 2006',
    school:
      'Střední škola Náhorní – Propagační výtvarnictví (zakončeno maturitní zkouškou)',
  },
  {
    years: '2006 – 2007',
    school:
      'Jazyková škola Glossa (anglický jazyk) (zakončeno mezinárodní zkoušku City&Guilts – úroveň upper-intermediate)',
  },
  {
    years: '2007 – 2008',
    school: 'Vyšší odborná škola uměleckoprůmyslová v Praze',
  },
  {
    years: '2008 – 2011',
    school:
      'Vyšší odborná škola Václava Hollara – Interaktivní grafika (zakončeno absolventskou zkouškou 2011)',
  },
];

export const getEducation = () => {
  return education;
};

export const getLanguages = () => {
  return languages;
};

const hobbies = 'Kresba, copywriting, jazyky, cestování, zvířata, houby';
export const getHobbies = () => {
  return hobbies;
};

const jobs = [
  {
    name: `(externě) Kompletní grafická tvorba výukového CD Finanční
gramotnost pro základní školy – grafické provedení
všech her včetně animací
Tvorba bannerů pro ČSOB a Soukromá základní škola
Škola hrou
Ústav patologické fyziologie, 1.lékařská fakulta UK,

laboratoř kybernetiky a počítačové podpory výuky-
tvorba výukových animací pro mediky

Reklamní agentura Linea Recta – občasné grafické práce
Výuka angličtiny ve firmě MayConsulting
Administrativní a grafické práce pro firmu Vinergo`,
    years: '2000 – 2010',
  },
  {
    name: `Grafické studio Proboston Creative – tvorba bannerů
a propagačních materiálů pro firmu T-Mobile, Lentilky,
Mlékárnu Kunín a další
Grafické studio Eniva – tvorba tiskových materiálů pro
firmu Unilever`,
    years: '2011',
  },
  {
    name: `(externě – hlavní grafička) Realitní kancelář Dumrealit.cz – pravidelná tvorba
bannerů na stránky sreality.cz, webové stánky, příprava
eshopu, návrhy časopisu, letáky a mnoho dalšího`,
    years: '2011 – 2014',
  },
  {
    name: `Grafické studio Occto – kreativní grafik
tvorba webové a tiskové grafiky, animací, výroba
statických 3D modelů, překlady z anglického jazyka`,
    years: '2013 – 2018',
  },
  {
    name: `Česká televize – Skriptka v českém, slovenském
a anglickém jazyce`,
    years: '2018 – 2020',
  },
  {
    name: `Dvorní grafička: AgreFlex
Externí grafička Solar Global, AKU-BAT, Batulino, REsolar
a další`,
    years: '2019',
  },
];

export const getJobs = () => {
  return jobs;
};

const AboutIntro = () => {
  return (
    <>
      <p>
        V grafice dělám už přes deset let. Mám široký záběr, zvládnu web, tisk,
        animaci, do 3D bych se musela znovu trochu vpravit, ale něco
        jednoduššího nebude problém.
      </p>

      <p>
        Moje specialita je tvorba logotypu. Mnohokrát jsem byla u projektu od
        jejího zrodu, ráda vám pomůžu s názvem nové firmy a navrhnu logo na míru
        vašim potřebám.
      </p>

      <p>
        Dále není problém vyrobit jednoduché i složitější mnohastránkové
        tiskoviny s vazbou, webové bannery a reklamu pro sociální sítě.
      </p>

      <p>
        Minimálně stahuji hotovou grafiku z fotobank, dělám vše na míru pro
        konkrétního klienta, takže u mě máte jistotu originality a neuvidíte
        stejnou nebo podobnou grafiku u desítek dalších firem, jak se to dnes
        běžně děje.
      </p>

      <p>
        Jsem trpělivá, spolehlivá. Ráda vám vždy vysvětlím, jaké podklady jsou
        potřeba, je mi jasné, že se v designerské hantýrce nemusíte orientovat.
        Práci vždy odevzdávám v domluveném termínu, je možné se dohodnout i na
        expresním dodání.
      </p>
    </>
  );
};
const about = {
  photo: 'about.jpg',
  intro: <AboutIntro />,
};
export const getAbout = () => {
  return about;
};
