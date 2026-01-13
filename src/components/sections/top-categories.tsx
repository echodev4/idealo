import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

type CategoryLink = {
  name: string;
};

type Category = {
  title: string;
  links: CategoryLink[];
};

const categoriesData: Category[] = [
  {
    title: 'singleCategory.gaming.title',
    links: [
      { name: 'singleCategory.gaming.ps4Controller' },
      { name: 'singleCategory.gaming.pokemonPrismCards' },
      { name: 'singleCategory.gaming.pokemonCards' },
      { name: 'singleCategory.gaming.switchController' },
      { name: 'singleCategory.gaming.xboxController' },
      { name: 'singleCategory.gaming.tonieFigures' },
      { name: 'singleCategory.gaming.nintendoGames' },
      { name: 'singleCategory.gaming.legoStarWars' },
      { name: 'singleCategory.gaming.jellycatToys' },
    ],
  },
  {
    title: 'singleCategory.fashion.title',
    links: [
      { name: 'singleCategory.fashion.samsonite' },
      { name: 'singleCategory.fashion.adidasSneakers' },
      { name: 'singleCategory.fashion.longchamp' },
      { name: 'singleCategory.fashion.calvinBoxers' },
      { name: 'singleCategory.fashion.onitsukaSneakers' },
      { name: 'singleCategory.fashion.pandoraBracelets' },
      { name: 'singleCategory.fashion.skechersSlipons' },
    ],
  },
  {
    title: 'singleCategory.foodDrink.title',
    links: [
      { name: 'singleCategory.foodDrink.dolceGusto' },
      { name: 'singleCategory.foodDrink.desperados' },
      { name: 'singleCategory.foodDrink.tanqueray' },
      { name: 'singleCategory.foodDrink.absolut' },
      { name: 'singleCategory.foodDrink.donPapa' },
      { name: 'singleCategory.foodDrink.threeSixty' },
    ],
  },
  {
    title: 'singleCategory.homeGarden.title',
    links: [
      { name: 'singleCategory.homeGarden.makita' },
      { name: 'singleCategory.homeGarden.poolCovers' },
      { name: 'singleCategory.homeGarden.outdoorRugs' },
      { name: 'singleCategory.homeGarden.stokkeChairs' },
      { name: 'singleCategory.homeGarden.acUnits' },
      { name: 'singleCategory.homeGarden.euroPallets' },
      { name: 'singleCategory.homeGarden.dysonPurifier' },
      { name: 'singleCategory.homeGarden.lotusGrill' },
      { name: 'singleCategory.homeGarden.einhellMower' },
      { name: 'singleCategory.homeGarden.lafumaChairs' },
      { name: 'singleCategory.homeGarden.fansQuiet' },
      { name: 'singleCategory.homeGarden.gasBottles' },
      { name: 'singleCategory.homeGarden.einhellBatteries' },
      { name: 'singleCategory.homeGarden.hensslerPans' },
    ],
  },
];

const TopCategories = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-[32px] font-bold text-[#333] mb-6">
          {t('topCategories.title')}
        </h2>
        <div className="flex flex-wrap -mx-3">
          {categoriesData.map((category) => (
            <div key={category.title} className="w-full sm:w-1/2 lg:w-1/3 px-3 mb-8"
            >
              <h3 className="text-lg font-bold text-[#333] mb-4">
                {t(category.title)}
              </h3>
              <ul className="list-none p-0 m-0">
                {category.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      className="block text-sm text-[#333] py-1 hover:text-primary transition-colors cursor-pointer"
                      href={(`/category/${t(`${link.name}`)}`)}
                    >
                      {t(link.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCategories;
