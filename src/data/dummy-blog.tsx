import type { ReactNode } from 'react';

export type BlogPost = {
  slug: string;
  title: string;
  image: string;
  intro: string;
  text: ReactNode;
};

const Blog1 = () => {
  return (
    <>
      <p>
        Nikdo nemůže chtít po klientech, aby se skvěle vyznali v designerské
        hantýrce, měli přehled o grafických formátech, programech a barevných
        režimech. Já vám vždy rád vysvětlím, proč mám takové či jiné požadavky a
        že s některými podklady se prostě pracovat nedá. Proto prosím za všechny
        grafiky, pokud vás přesvědčujeme, že tato velikost na plakát opravdu
        nestačí, že barevnost opravdu musí být CMYK, že pro výšivku je nutný
        vektor, věřte nám, že je to opravdu nutné a vše děláme jen proto, aby
        vaše výsledné materiály vypadaly skutečně dobře. Omluvte prosím i to,
        když se grafik trošičku rozčílí, možná, že už podobnou věc řešil
        stokrát. U mě se nebojte, vždy vám rád odpovím na všechny dotazy.
      </p>
      <p>
        Ty věčné otázky...
        <br /> Samozřejmě začnete tím, že si vyberete grafika a ani to není nic
        snadného. Když ale uvidíte portfolio, které bude rezonovat s vaším
        vkusem, máte výborně našlápnuto na dobrou spolupráci. Pak ale přijde
        samotné zadání. Věřte, že veškerý čas, který strávíte na začátku s jeho
        vyladěním, vám ušetří mnohem více času (a tím také peněz) později.
        Správný grafik by se s vámi měl ještě před začátkem práce dohodnout,
        kolik návrhů odevzdá, kolik případných připomínek (korektur) budete mít
        v ceně a pak samozřejmě - jak by měla odevzdaná práce vypadat. Jistě,
        grafik by se měl ptát. Ale někdy ani nemusí vědět přesně na co. Před
        týdnem jste viděli u konkurence (no, jak si to mohli dovolit!) moc
        pěknou reklamu? Předloni vám grafik něco namaloval a docela se to
        líbilo, tak co to trochu zmodernizovat, učesat a pokračovat v podobném
        duchu? Nebo naopak tahle věc je hrozná, nic takovýho bych rozhodně
        nechtěl. Ale, co je hrozné pro jednoho, může být perfektní pro druhého.
        Proto, i když je grafik velmi vděčný za vaši důvěru v jeho schopnosti,
        bude bedlivě poslouchat všemu, co ho přiblíží k vaší závěrečné
        spokojenosti (protože ani jedna strana nemá ráda:
        Logotyp_ver_28_Fin_oprava_posledni).
      </p>
    </>
  );
};

const Blog2 = () => {
  return (
    <>
      <p>
        Představte si, že váš grafik je váš osobní kuchař...
        <br />
        Ten návrh je moc pěkný, ale chci radši ještě další tři, ať mám z čeho
        vybírat.
        <br />
        Výborný oběd, ale zkuste uvařit ještě tři.
      </p>
      <p>
        Chci něco pěkného, máte volnou ruku. Vy jste grafik, tak víte určitě
        nejlíp, jak na to.
        <br />
        Potřebujete vědět, jaké mám chutě? No, chutná mi dobré jídlo.
      </p>
      <p>
        Chci něco jednoduchého
        <br />
        Chci svíčkovou, ale jen ze tří přísad.
      </p>
      <p>
        To vám zabere chvilku
        <br />
        To hovězí na víně určitě zvládnete za půl hodiny.
      </p>
      <p>
        Přidejte tam tyhle obrázky, zvětšete tohle logo.
        <br />
        Přidejte mi do svého receptu kopr a nasypte tam lžíci soli.
      </p>
      <p>
        Vymyslete i nějaký text
        <br />
        Až mi uvaříte, přijďte mě ostříhat.
      </p>
      <p>
        Použijte tyhle fotky z Google.
        <br />
        Běžte ukrást do obchodu řízek, je moc drahý.
      </p>
      <p>
        Pošlete zdrojová data.
        <br />
        Napište mi tecept, ona mi to příště uvaří doma manželka.
      </p>
      <p>
        Je to skvělá položka do portfolia.
        <br />
        Dejte mi jídlo zdarma a já řeknu, že jsem u vás jedl.
      </p>
      <p>
        To zvládne moje asistentka v Powerpointu.
        <br />
        Rumpsteak a kližka je oboje hovězí, tak proč stojí 4x tolik?
      </p>
      <p>
        Logo na ten billboard? Jo to mám... logo1.doc
        <br />
        Udělejte mi chřestovou polévku, tady jsou brambory.
      </p>
      <p>
        Chci vánoční přání, ale aby nepůsobilo moc vánočně.
        <br />
        Chci vánoční večeři, ale ať ten kapr chutná jako kachna.
      </p>
    </>
  );
};

const blogs: BlogPost[] = [
  {
    slug: 'jo-grafik-ten-tvrdy-chleb-ma',
    title: 'Jó, grafik ten tvrdý chleba má...',
    image: 'blog1.jpg',
    intro:
      'Nikdo nemůže chtít po klientech, aby se skvěle vyznali v designerské hantýrce, měli přehled o grafických formátech, programech a barevných režimech',
    text: <Blog1 />,
  },
  {
    slug: 'grafik-na-taliri',
    title: 'Grafik na talíři',
    image: 'blog2.jpg',
    intro: 'Představte si, že váš grafik je váš osobní kuchař...',
    text: <Blog2 />,
  },
];

export const getBlogs = () => blogs;

export const getBlogBySlug = (slug: string) =>
  blogs.find((blog) => blog.slug === slug);
