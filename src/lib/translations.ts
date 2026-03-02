import { Locale } from '@/lib/i18n/types';

export const translations: Record<Locale, any> = {
  en: {
    header: {
      skipLinks: {
        navigation: "Skip to navigation",
        search: "Skip to search",
        main: "Skip to main content",
      },
      navigation: {
        shopping: "Shopping",
        flight: "Flight",
        magazine: "Magazine",
      },
      sustainability: "Sustainability",
      atIdealo: "at idealo",
      search: {
        placeholder: "I'm looking for ...",
        searchButton: "Search",
        clearSearch: "Clear search",
        popularSearchesTitle: "Popular searches",
        recentlySearchedTitle: "Recently searched",
        noRecentSearches: "No recent searches",
        loading: "Loading...",
        suggestions: "Suggestions",
        noSuggestionsFound: "No suggestions found",
        products: "Products",
        noProductsFound: "No products found",
      },
      actions: {
        cards: "Cards",
        notepad: "Notepad",
        priceAlert: "Price alert",
        register: "Register",
      },
      aria: {
        home: "Home",
        categories: "Categories",
        scrollCategoriesLeft: "Scroll categories left",
        scrollCategoriesRight: "Scroll categories right",
      },
      categories: {
        deals: "Deals",
        electricalGoods: "Electrical goods",
        sportsOutdoors: "Sports & Outdoors",
        babyChild: "Baby & Child",
        homeGarden: "Home & Garden",
        foodDrink: "Food & Drink",
        gamingPlay: "Gaming & Play",
        drugstoreHealth: "Drugstore & Health",
        carsMotorcycles: "Cars & Motorcycles",
        fashionAccessories: "Fashion & Accessories",
        petSupplies: "Pet supplies",
        flight: "Flight",
      },
      popularSearches: {
        electronics: "Electronics",
        sportsOutdoor: "Sports & Outdoor",
        babyKids: "Baby & Kids",
        homeGarden: "Home & Garden",
        foodDrink: "Food & Drink",
        gamingToys: "Gaming & Toys",
        healthBeauty: "Health & Beauty",
        automotive: "Automotive",
        fashionAccessories: "Fashion & Accessories",
        petSupplies: "Pet Supplies",
      },
    },
  },

  ar: {
    header: {
      skipLinks: {
        navigation: "الانتقال إلى التنقل",
        search: "الانتقال إلى البحث",
        main: "الانتقال إلى المحتوى الرئيسي",
      },
      navigation: {
        shopping: "التسوق",
        flight: "الرحلات",
        magazine: "المجلة",
      },
      sustainability: "الاستدامة",
      atIdealo: "في idealo",
      search: {
        placeholder: "أنا أبحث عن ...",
        searchButton: "بحث",
        clearSearch: "مسح البحث",
        popularSearchesTitle: "عمليات البحث الشائعة",
        recentlySearchedTitle: "تم البحث عنه مؤخرا",
        noRecentSearches: "لا توجد عمليات بحث حديثة",
        loading: "جاري التحميل...",
        suggestions: "الاقتراحات",
        noSuggestionsFound: "لم يتم العثور على اقتراحات",
        products: "المنتجات",
        noProductsFound: "لم يتم العثور على منتجات",
      },
      actions: {
        cards: "البطاقات",
        notepad: "المفكرة",
        priceAlert: "تنبيه السعر",
        register: "تسجيل",
      },
      aria: {
        home: "الرئيسية",
        categories: "الفئات",
        scrollCategoriesLeft: "تمرير الفئات لليسار",
        scrollCategoriesRight: "تمرير الفئات لليمين",
      },
      categories: {
        deals: "العروض",
        electricalGoods: "الأجهزة الكهربائية",
        sportsOutdoors: "الرياضة والأنشطة الخارجية",
        babyChild: "الأطفال والرضع",
        homeGarden: "المنزل والحديقة",
        foodDrink: "الطعام والشراب",
        gamingPlay: "الألعاب والترفيه",
        drugstoreHealth: "الصحة والعناية",
        carsMotorcycles: "السيارات والدراجات النارية",
        fashionAccessories: "الموضة والإكسسوارات",
        petSupplies: "مستلزمات الحيوانات الأليفة",
        flight: "الرحلات",
      },
      popularSearches: {
        electronics: "الإلكترونيات",
        sportsOutdoor: "الرياضة والهواء الطلق",
        babyKids: "الأطفال والرضع",
        homeGarden: "المنزل والحديقة",
        foodDrink: "الطعام والشراب",
        gamingToys: "الألعاب والهوايات",
        healthBeauty: "الصحة والجمال",
        automotive: "السيارات",
        fashionAccessories: "الموضة والإكسسوارات",
        petSupplies: "مستلزمات الحيوانات الأليفة",
      },
    },
  },
};

// Helper function to get nested translation
export function getTranslation(
  locale: Locale,
  key: string,
  fallback?: string
): string {
  const keys = key.split('.');
  let value: any = translations[locale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return fallback || key;
    }
  }

  return typeof value === 'string' ? value : fallback || key;
}

// Translation hook utility
export function useTranslations(locale: Locale) {
  return {
    t: (key: string, fallback?: string) => getTranslation(locale, key, fallback),
    translations: translations[locale],
  };
}
