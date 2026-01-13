import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

interface TrendingCategory {
  key: string;
  imageUrl: string;
}

const trendingCategories: TrendingCategory[] = [
  {
    key: "wlanAmplifier",
    imageUrl: "https://cdn.idealo.com/images/category/de_DE/3103/240x200.jpg"
  },
  {
    key: "womensJacketsCoats",
    imageUrl: "https://cdn.idealo.com/images/category/de_DE/16842/240x200.jpg",
  },
  {
    key: "outdoorJackets",
    imageUrl: "https://cdn.idealo.com/images/category/de_DE/27741/240x200.jpg",
  },
  {
    key: "electricHeaters",
    imageUrl: "https://cdn.idealo.com/images/category/de_DE/6412/240x200.jpg",
  },
  {
    key: "mensJacketsCoats",
    imageUrl: "https://cdn.idealo.com/images/category/de_DE/16863/240x200.jpg",
  },
  {
    key: "rubberBoots",
    imageUrl: "https://cdn.idealo.com/images/category/de_DE/18837/240x200.jpg",
  },
  {
    key: "outdoorHeaters",
    imageUrl: "https://cdn.idealo.com/images/category/de_DE/10932/240x200.jpg",
  },
  {
    key: "fireplacesStoves",
    imageUrl: "https://cdn.idealo.com/images/category/de_DE/11294/240x200.jpg",
  },
  {
    key: "kidsOveralls",
    imageUrl: "https://cdn.idealo.com/images/category/de_DE/25529/240x200.jpg",
  },
  {
    key: "kidsJacketsCoats",
    imageUrl: "https://cdn.idealo.com/images/category/de_DE/25578/240x200.jpg",
  },
];

const TrendingNow = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-background py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          {t("trendingNow.heading")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
          {trendingCategories.map((category) => (
            <Link
              key={category.key}
              className="group text-center cursor-pointer"
              href={(`/category/${t(`trendingNow.${category.key}`)}`)}
            >
              <div className="overflow-hidden rounded-lg">
                <Image
                  src={category.imageUrl}
                  alt={t(`trendingNow.${category.key}`)}
                  width={240}
                  height={200}
                  className="w-full h-auto object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>
              <span className="mt-2 inline-block text-sm font-medium text-foreground group-hover:text-accent transition-colors duration-200">
                {t(`trendingNow.${category.key}`)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingNow;
