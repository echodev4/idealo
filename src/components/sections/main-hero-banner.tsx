"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';

const MainHeroBanner = () => {
  const { t } = useLanguage();
  
  return (
    <a
      href="https://www.idealo.de/aktion/25jahreidealo"
      className="group relative block h-[264px] w-[544px] overflow-hidden rounded-lg"
      aria-label={`${t('hero.tagline')} ${t('hero.cta')}`}
    >
      <Image
        src="https://cdn.idealo.com/storage/teaser/de_DE/images/XL_NEWandXXL_NEW_544_a8998dce-1dab-4225-a30b-ef6b44ff3f4a_superteaser_template_NEW-l.jpg"
        alt=""
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-300 ease-in-out group-hover:scale-105"
        priority
      />
      <div 
        className="absolute inset-0 flex flex-col justify-end p-6 text-white"
        style={{ background: 'linear-gradient(180deg, rgba(0, 0, 82, 0) 0%, rgb(0, 0, 82) 56.41%)' }}
      >
        <h3 className="text-2xl font-bold leading-7 mb-1 font-display">
          {t('hero.tagline')}
        </h3>
        <div className="text-base font-bold leading-5 font-body">
          {t('hero.cta')}
        </div>
      </div>
    </a>
  );
};

export default MainHeroBanner;