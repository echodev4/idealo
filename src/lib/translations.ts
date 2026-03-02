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
    footer: {
      columns: {
        idealo: {
          title: "idealo",
          links: {
            aboutUs: "About Us",
            sustainability: "sustainability",
            disposal: "Disposal of old appliances",
            press: "press",
            jobs: "Jobs",
            friends: "Friends",
          },
        },
        trip: {
          title: "Trip",
          links: {
            flightPriceComparison: "Flight price comparison",
          },
        },
        business: {
          title: "Business",
          links: {
            dealers: "dealers",
            serviceProvider: "service provider",
            shopRegistration: "Shop registration",
            affiliate: "Affiliate Partner Program",
            partnerMagazine: "idealo Partner Magazine",
          },
        },
        followUs: {
          title: "Follow us",
          links: {
            newsletter: "Newsletter",
            magazine: "idealo magazine",
            facebook: "Facebook",
            instagram: "Instagram",
          },
        },
      },
      mobile: {
        appCta: "Bring the idealo price comparison to your smartphone!",
        appStoreAlt: "App Store",
        googlePlayAlt: "Google Play",
      },
      legalLinks: {
        dataProtection: "Data protection",
        privacy: "Privacy",
        terms: "Legal Notice / Terms and Conditions",
        accessibility: "Accessibility",
      },
      countries: {
        austria: "Austria",
        greatBritain: "Great Britain",
        spain: "Spain",
        france: "France",
        italy: "Italy",
      },
      disclaimer: {
        prices:
          "All prices are in euros including VAT, plus shipping if applicable. Prices, rankings, delivery times, and shipping costs are subject to change. Delivery times are in days (Monday-Friday, excluding public holidays).",
        reviews:
          'We publish consumer reviews (product opinions) on our website. We have not verified whether these reviews are from consumers who have actually used or purchased the reviewed product, unless the review is marked as "verified opinion."',
        moreInfo: "Further information can be found on the respective product detail page.",
      },
    },
    landing: {
      heroTeaser: {
        tips: {
          dealsOfDay: "Deals of the day",
          pokemon: "30 Years of Pokemon",
          homeCinema: "Your home cinema",
          snow: "Off to the snow",
          ourTips: "Our 3 Tips",
        },
        popularProducts: "Popular products",
        badges: {
          bestseller: "bestseller",
        },
        inSource: "in",
        from: "from",
        banner: {
          alt: "Campaign banner",
          title: "30 Years of Pokemon",
          cta: "Grab them all!",
        },
        aria: {
          teaserTips: "Teaser tips",
          previousTips: "Previous tips",
          nextTips: "Next tips",
          popularProducts: "Popular products",
          wishlist: "Wishlist",
          previousProducts: "Previous products",
          nextProducts: "Next products",
        },
      },
      bestsellersCarousel: {
        title: "Dairy deals",
        badges: {
          featured: "featured",
        },
        inSource: "in",
        from: "from",
        aria: {
          wishlist: "Wishlist",
          previous: "Previous",
          next: "Next",
        },
      },
      newsletterCta: {
        title: "Receive idealo deals, promotions & news via email.",
        button: "Subscribe to the newsletter",
      },
      relatedCategories: {
        sections: {
          discoverBestsellers: "Discover the bestsellers",
          relatedCategories: "Related categories",
          matchingProducts: "Matching products",
        },
        categories: {
          skiJackets: "Ski jackets",
          functionalUnderwear: "Functional underwear",
          alpineSkiing: "Alpine skiing",
        },
        labels: {
          in: "in",
          from: "from",
        },
        badges: {
          bestseller: "bestseller",
        },
        promo: {
          alt: "Promo",
          cta: "Discover now",
        },
        aria: {
          wishlist: "Wishlist",
          previous: "Previous",
          next: "Next",
        },
      },
      trendingProducts: {
        title: "Currently trending",
        items: {
          shoppingBags: "Shopping bags",
          tradingCards: "Trading cards",
          childrensShoes: "Children's shoes",
          fertilizer: "Fertilizer",
          hedgeTrimmers: "Hedge trimmers",
          roboticLawnmower: "Robotic lawnmower",
          bicycleCarrier: "Bicycle carrier",
          jerseys: "Jerseys",
        },
        aria: {
          previous: "Previous",
          next: "Next",
        },
      }
    },
    categoryPage: {
      productsFound: "products found",
      filters: "Filters",
      sort: {
        popular: "Most popular first",
        savings: "Biggest savings first",
        cheap: "Price: Cheapest first",
        high: "Price: Highest first",
        newest: "Newest first",
      },
    },
    category: {
      filtersSidebar: {
        filters: "Filters",
        priceRange: "Price Range",
        to: "to",
        showing: "Showing",
        results: "results",
        showAll: "Show all",
        showLess: "Show less",
        resetFilters: "Reset Filters",
        department: "Department",
        ageRange: "Age range",
        targetAgeRange: "Target age range",
        color: "Color",
        size: "Size",
        material: "Material",
        features: "Features",
        fit: "Fit",
        occasion: "Occasion",
        pattern: "Pattern",
        manufacturer: "Manufacturer",
        internalMemory: "Internal memory",
        ram: "R.A.M.",
        networkType: "Network type",
        operatingSystem: "Operating system",
        simCard: "SIM card",
        dietaryNeeds: "Dietary needs",
        itemForm: "Item form",
        packQuantity: "Pack quantity",
      },
      products: {
        productDetailsTitle: "تفاصيل المنتج",
        overview: "نظرة عامة",
        highlights: "أبرز المميزات",
        conclusion: "خلاصة فريق التحرير",
        showOffers: "عرض العروض",
        show: "عرض",
        advantages: "المزايا",
        disadvantages: "العيوب",
        notAvailable: "غير متاح",
        productDetailsSection: "تفاصيل المنتج",
        noSpecifications: "لا توجد مواصفات متاحة",
        otherProducts: "منتجات أخرى",
        from: "من",
        productDetailsButton: "تفاصيل المنتج",
        placeholderDescription: "خوذة تزلج متعددة الاستخدامات بتقنية in-mold مع حماية جانبية من الصدمات (MIPS)",
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
    footer: {
      columns: {
        idealo: {
          title: "idealo",
          links: {
            aboutUs: "من نحن",
            sustainability: "الاستدامة",
            disposal: "التخلص من الأجهزة القديمة",
            press: "الصحافة",
            jobs: "الوظائف",
            friends: "الأصدقاء",
          },
        },
        trip: {
          title: "الرحلات",
          links: {
            flightPriceComparison: "مقارنة أسعار الرحلات",
          },
        },
        business: {
          title: "الأعمال",
          links: {
            dealers: "التجار",
            serviceProvider: "مزود الخدمة",
            shopRegistration: "تسجيل المتجر",
            affiliate: "برنامج شركاء الأفلييت",
            partnerMagazine: "مجلة شركاء idealo",
          },
        },
        followUs: {
          title: "تابعنا",
          links: {
            newsletter: "النشرة البريدية",
            magazine: "مجلة idealo",
            facebook: "فيسبوك",
            instagram: "إنستغرام",
          },
        },
      },
      mobile: {
        appCta: "خذ مقارنة الأسعار من idealo إلى هاتفك الذكي!",
        appStoreAlt: "آب ستور",
        googlePlayAlt: "جوجل بلاي",
      },
      legalLinks: {
        dataProtection: "حماية البيانات",
        privacy: "الخصوصية",
        terms: "إشعار قانوني / الشروط والأحكام",
        accessibility: "إمكانية الوصول",
      },
      countries: {
        austria: "النمسا",
        greatBritain: "بريطانيا العظمى",
        spain: "إسبانيا",
        france: "فرنسا",
        italy: "إيطاليا",
      },
      disclaimer: {
        prices:
          "جميع الأسعار باليورو وتشمل ضريبة القيمة المضافة، بالإضافة إلى الشحن إن وجد. قد تتغير الأسعار والترتيبات وأوقات التسليم وتكاليف الشحن. أوقات التسليم محسوبة بالأيام (من الإثنين إلى الجمعة، باستثناء العطل الرسمية).",
        reviews:
          "ننشر تقييمات المستهلكين (آراء المنتجات) على موقعنا. لم نتحقق مما إذا كانت هذه التقييمات من مستهلكين استخدموا المنتج المراجع أو اشتروه فعلا، إلا إذا تم تمييز التقييم بأنه رأي موثق.",
        moreInfo: "يمكن العثور على مزيد من المعلومات في صفحة تفاصيل المنتج المعنية.",
      },
    },
    landing: {
      heroTeaser: {
        tips: {
          dealsOfDay: "عروض اليوم",
          pokemon: "30 سنة من بوكيمون",
          homeCinema: "سينما منزلك",
          snow: "إلى الثلج",
          ourTips: "أفضل 3 نصائح",
        },
        popularProducts: "المنتجات الشائعة",
        badges: {
          bestseller: "الأكثر مبيعا",
        },
        inSource: "في",
        from: "من",
        banner: {
          alt: "بانر الحملة",
          title: "30 سنة من بوكيمون",
          cta: "احصل عليها كلها!",
        },
        aria: {
          teaserTips: "تلميحات البانر",
          previousTips: "التلميحات السابقة",
          nextTips: "التلميحات التالية",
          popularProducts: "المنتجات الشائعة",
          wishlist: "المفضلة",
          previousProducts: "المنتجات السابقة",
          nextProducts: "المنتجات التالية",
        },
      },
      bestsellersCarousel: {
        title: "عروض الألبان",
        badges: {
          featured: "مميز",
        },
        inSource: "في",
        from: "من",
        aria: {
          wishlist: "المفضلة",
          previous: "السابق",
          next: "التالي",
        },
      },
      newsletterCta: {
        title: "احصل على عروض idealo والتخفيضات والأخبار عبر البريد الإلكتروني.",
        button: "اشترك في النشرة البريدية",
      },
      relatedCategories: {
        sections: {
          discoverBestsellers: "اكتشف الأكثر مبيعا",
          relatedCategories: "فئات ذات صلة",
          matchingProducts: "منتجات مطابقة",
        },
        categories: {
          skiJackets: "سترات التزلج",
          functionalUnderwear: "ملابس داخلية وظيفية",
          alpineSkiing: "التزلج الألبي",
        },
        labels: {
          in: "في",
          from: "من",
        },
        badges: {
          bestseller: "الأكثر مبيعا",
        },
        promo: {
          alt: "إعلان",
          cta: "اكتشف الآن",
        },
        aria: {
          wishlist: "المفضلة",
          previous: "السابق",
          next: "التالي",
        },
      },
      trendingProducts: {
        title: "الأكثر رواجا حاليا",
        items: {
          shoppingBags: "حقائب التسوق",
          tradingCards: "بطاقات التداول",
          childrensShoes: "أحذية الأطفال",
          fertilizer: "الأسمدة",
          hedgeTrimmers: "مقصات التحوط",
          roboticLawnmower: "جزازة عشب روبوتية",
          bicycleCarrier: "حامل دراجة",
          jerseys: "قمصان رياضية",
        },
        aria: {
          previous: "السابق",
          next: "التالي",
        },
      },
    },
    categoryPage: {
      productsFound: "منتج تم العثور عليه",
      filters: "الفلاتر",
      sort: {
        popular: "الأكثر شعبية أولا",
        savings: "أكبر توفير أولا",
        cheap: "السعر: الأرخص أولا",
        high: "السعر: الأعلى أولا",
        newest: "الأحدث أولا",
      },
    },
    category: {
      filtersSidebar: {
        filters: "الفلاتر",
        priceRange: "نطاق السعر",
        to: "إلى",
        showing: "عرض",
        results: "نتيجة",
        showAll: "عرض الكل",
        showLess: "عرض أقل",
        resetFilters: "إعادة ضبط الفلاتر",
        department: "القسم",
        ageRange: "الفئة العمرية",
        targetAgeRange: "الفئة العمرية المستهدفة",
        color: "اللون",
        size: "المقاس",
        material: "الخامة",
        features: "الميزات",
        fit: "القياس",
        occasion: "المناسبة",
        pattern: "النمط",
        manufacturer: "الشركة المصنعة",
        internalMemory: "الذاكرة الداخلية",
        ram: "الرام",
        networkType: "نوع الشبكة",
        operatingSystem: "نظام التشغيل",
        simCard: "بطاقة SIM",
        dietaryNeeds: "الاحتياجات الغذائية",
        itemForm: "شكل المنتج",
        packQuantity: "كمية العبوة",
      },
      products: {
        productDetailsTitle: "تفاصيل المنتج",
        overview: "نظرة عامة",
        highlights: "أبرز الميزات",
        conclusion: "خلاصة فريق التحرير",
        showOffers: "عرض العروض",
        show: "عرض",
        advantages: "المزايا",
        disadvantages: "العيوب",
        notAvailable: "غير متاح",
        productDetailsSection: "تفاصيل المنتج",
        noSpecifications: "لا توجد مواصفات متاحة",
        otherProducts: "منتجات أخرى",
        from: "من",
        productDetailsButton: "تفاصيل المنتج",
        placeholderDescription: "خوذة تزلج متعددة الاستخدامات بتقنية in-mold مع حماية جانبية من الصدمات (MIPS)",
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
