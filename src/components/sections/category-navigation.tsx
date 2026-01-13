"use client";

import Link from 'next/link';
import {
  Baby,
  Car,
  Gamepad2,
  Home,
  Mountain,
  PawPrint,
  Pill,
  Plug,
  Shirt,
  Utensils,
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

const categoryKeys = [
  { key: 'electronics',icon: Plug },
  { key: 'sportsOutdoor',icon: Mountain },
  { key: 'babyKids',  icon: Baby },
  { key: 'homeGarden', icon: Home },
  { key: 'foodDrink',  icon: Utensils },
  { key: 'gaming',  icon: Gamepad2 },
  { key: 'health', icon: Pill },
  { key: 'automotive', icon: Car },
  { key: 'fashion', icon: Shirt },
  { key: 'pets', icon: PawPrint },
];

const CategoryNavigation = () => {
  const { t, direction } = useLanguage();

  return (
    <section className="bg-secondary" aria-label={t('categories.all')}>
      <div className="container mx-auto">
        <nav className={`flex items-center justify-between overflow-x-auto py-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
          {categoryKeys.map((category, index) => {
            const Icon = category.icon;
            const isFirst = index === 0;
            const categoryName = t(`categories.${category.key}`);

            const itemContent = (
              <Link href={`/category/${categoryName}`} className='flex flex-col items-center gap-[6px]'>
                <>
                  <Icon
                    className={`h-6 w-6 transition-colors duration-200 ${isFirst ? 'text-accent' : 'text-foreground group-hover:text-accent'
                      }`}
                    strokeWidth="1.5"
                  />
                  <span className="text-center text-xs font-medium leading-tight text-foreground transition-colors duration-200 group-hover:text-accent">
                    {categoryName}
                  </span>
                </>
              </Link>
            );

            const itemWrapperClasses = "group flex flex-col items-center space-y-1 py-1 w-[95px]";

            if (isFirst) {
              return (
                <form key={category.key} className="flex-shrink-0">
                  <button type="button" className={itemWrapperClasses}>
                    {itemContent}
                  </button>
                </form>
              );
            }

            return (
              <p key={category.key} className={`${itemWrapperClasses} flex-shrink-0 cursor-pointer`}>
                {itemContent}
              </p>
            );
          })}
        </nav>
      </div>
    </section>
  );
};

export default CategoryNavigation;