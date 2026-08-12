'use client';

import Image from 'next/image';
import { useState } from 'react';

import type { Categories } from '@/types/types';

import { getPortfolio, getCategoryProjects } from '@/data/dummy-portfolio';

const Portfolio = () => {
  const portfolio = getPortfolio();
  const [category, setCategory] = useState<Categories | 'vse'>('vse');
  const projects = getCategoryProjects(category).filter(
    (project) => project.image,
  );

  return (
    <>
      <div className="mx-auto my-16 container">
        <div className="flex justify-center gap-4">
          <button
            className={`category-button ${category === 'print' && 'active'}`}
            onClick={() => setCategory('print')}
          >
            {portfolio.categories[0]}
          </button>
          <button
            className={`category-button ${category === 'digital' && 'active'}`}
            onClick={() => setCategory('digital')}
          >
            {portfolio.categories[1]}
          </button>
          <button
            className={`category-button ${category === 'personal' && 'active'}`}
            onClick={() => setCategory('personal')}
          >
            {portfolio.categories[2]}
          </button>
          <button
            className={`category-button ${category === 'logo' && 'active'}`}
            onClick={() => setCategory('logo')}
          >
            {portfolio.categories[3]}
          </button>
          <button
            className={`category-button ${category === 'vse' && 'active'}`}
            onClick={() => setCategory('vse')}
          >
            {portfolio.categories[4]}
          </button>
        </div>
      </div>

      <div className="mx-auto mt-large container">
        <ul className="columns-1 gap-x-medium sm:columns-2 lg:columns-3">
          {projects.map((project) => (
            <li
              key={project.image}
              className="mb-medium w-full break-inside-avoid overflow-hidden rounded-xl shadow-xl"
            >
              <Image
                src={`/${project.image}.jpg`}
                alt={project.title}
                width={0}
                height={0}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full"
                style={{ width: '100%', height: 'auto' }}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Portfolio;
