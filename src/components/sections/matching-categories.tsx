import React from 'react';
import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';

const categories = [
  {
    name: 'PencilCases',
    imgSrc: 'https://cdn.idealo.com/images/category/de_DE/15716/240x200.jpg',
    imgAlt: 'Pencil Cases',
  },
  {
    name: 'ChildrenTables',
    imgSrc: 'https://cdn.idealo.com/images/category/de_DE/30828/240x200.jpg',
    imgAlt: 'Children’s Tables',
  },
  {
    name: 'WaterBottles',
    imgSrc: 'https://cdn.idealo.com/images/category/de_DE/21647/240x200.jpg',
    imgAlt: 'Water Bottles',
  },
  {
    name: 'SportsBags',
    imgSrc: 'https://cdn.idealo.com/images/category/de_DE/25915/240x200.jpg',
    imgAlt: 'Sports Bags',
  },
  {
    name: 'SchoolBags',
    imgSrc: 'https://cdn.idealo.com/images/category/de_DE/9232/240x200.jpg',
    imgAlt: 'School Bags',
  },
  {
    name: 'SchoolCones',
    imgSrc: 'https://cdn.idealo.com/images/category/de_DE/16338/240x200.jpg',
    imgAlt: 'School Cones',
  },
];

const MatchingCategories = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-background py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          {t('matching.matching')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              className="group block rounded-lg border border-border bg-card overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-lg cursor-pointer"
              href={(`/category/${t(`matching.${category.name}`)}`)}

            >
              <div className="overflow-hidden">
                <img
                  src={category.imgSrc}
                  alt={category.imgAlt}
                  width={240}
                  height={200}
                  className="w-full h-auto object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <strong className="text-base font-semibold text-card-foreground">
                  {t(`matching.${category.name}`)}
                </strong>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MatchingCategories;
