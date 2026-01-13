import { Backpack, Smartphone, Percent, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

const SchnaeppchenIcon = () => (
  <div className="relative w-14 h-14 flex items-center justify-center">
    <div
      className="w-[46px] h-8 bg-accent transform -rotate-[15deg] rounded-md"
      aria-hidden="true"
    />
    <Percent className="w-9 h-9 text-white absolute" strokeWidth={2.5} />
  </div>
);

const HeroCircles = () => {
  const { t } = useLanguage();

  const circleItemsData = [
    { href: "#", icon: <SchnaeppchenIcon />, label: t('heroCircles.dealOfDay') },
    { href: "#", icon: <Backpack className="w-12 h-12 text-white" />, label: t('heroCircles.backToSchool') },
    { href: "#", icon: <Smartphone className="w-12 h-12 text-white" />, label: t('heroCircles.newPixel') },
  ];

  return (
    <section aria-label="Promotional links cursor-pointer">
      <div className="flex items-start justify-start space-x-4 pl-1">
        {circleItemsData.map((item, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center cursor-not-allowed group"
          >
            <div className="w-[92px] h-[92px] bg-primary rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-md group-hover:shadow-lg">
              {item.icon}
            </div>

            <p className="mt-2 text-sm text-foreground font-normal leading-4 h-8 flex items-center justify-center relative">
              {item.label}

              {/* Tooltip */}
              <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap">
                Coming soon...
              </span>
            </p>

            {index === circleItemsData.length - 1 && (
              <div
                className="absolute -right-3 top-[33px] w-6 h-6 bg-gray-200/80 hover:bg-gray-300/80 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Next item"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroCircles;
