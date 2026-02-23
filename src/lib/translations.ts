import { Locale } from '@/lib/i18n/types';

export const translations: Record<Locale, any> = {
  en: {
    // Header Component
    header: {
      navigation: {
        shopping: 'SHOPPING',
        flight: 'FLIGHT',
        magazine: 'MAGAZINE',
      },
      sustainability: 'Sustainability',
      search: {
        placeholder: 'I\'m looking for ...',
        categories: 'Categories',
        searchButton: 'Search',
      },
      userActions: {
        wishlist: 'Wishlist',
        priceAlert: 'Price Alert',
        card: 'Cards',
        login: 'Sign In',
        register: 'Register',
        account: 'My Account',
        logout: 'Sign Out',
      },
      skipLinks: {
        main: 'Skip to main content',
        navigation: 'Skip to navigation',
        search: 'Skip to search',
      },
      anniversary: {
        years: 'YEARS',
        celebrating: 'Celebrating',
      },
    },


    categoryBar: {
      "ariaLabel": "Category bar",
      "prev": "Previous",
      "next": "Next",
      "disabled": "Not available",
      "items": {
        "deals": "Deals",
        "electronics": "Electronics",
        "sport": "Sports & Outdoor",
        "baby": "Baby & Kids",
        "home": "Home & Garden",
        "food": "Food & Drink",
        "gaming": "Gaming & Toys",
        "health": "Health & Beauty",
        "auto": "Automotive",
        "fashion": "Fashion & Accessories",
        "pets": "Pet Supplies",
        "flight": "Flight"
      }
    },


    "landing": {
      "hero": {
        "title": "Popular products",
        "badge": "Featured",
        "bannerAlt": "Campaign banner",
        "bannerTitle": "Special picks",
        "bannerCta": "Coming soon"
      },
      "newsletter": {
        "title": "Get deals & updates by email",
        "cta": "Subscribe to newsletter"
      },
      "carousel": {
        "badge": "Featured"
      },
      "common": {
        "from": "from",
        "rating": "Rating",
        "reviews": "Reviews",
        "wishlist": "Wishlist",
        "comingSoon": "Coming soon",
        "prev": "Previous",
        "next": "Next"
      }
    },



    "footer": {
      "brand": "SubsFaraz",
      "ctaLine": "Compare offers across stores and find the best price.",

      "about": "About us",
      "sustainability": "Sustainability",
      "press": "Press",
      "jobs": "Jobs",
      "blog": "Blog",

      "shopping": "Shopping",
      "comparePrices": "Compare prices",

      "support": "Customer service",
      "help": "Help center",
      "contact": "Contact us",

      "business": "Business",
      "retailers": "Retailers",
      "partners": "Partners",
      "registerShop": "Shop registration",
      "affiliates": "Affiliate program",

      "follow": "Follow us",
      "newsletter": "Newsletter",
      "instagram": "Instagram",
      "facebook": "Facebook",
      "youtube": "YouTube",

      "imprint": "Imprint",
      "privacy": "Privacy",
      "terms": "Terms",
      "cookies": "Cookies"
    },


    // Category Navigation
    categories: {
      electronics: 'Electronics',
      sportsOutdoor: 'Sports & Outdoor',
      babyKids: 'Baby & Kids',
      homeGarden: 'Home & Garden',
      foodDrink: 'Food & Drink',
      gaming: 'Gaming & Toys',
      health: 'Health & Beauty',
      automotive: 'Automotive',
      fashion: 'Fashion & Accessories',
      pets: 'Pet Supplies',
      flight: 'Flight',
      all: 'All Categories',
      popular: 'Popular Categories',
    },

    // Main Hero Banner
    hero: {
      tagline: 'Your Deal, your WOW:',
      cta: 'Discover Now',
      subtitle: 'Find the best deals and compare prices',
      featured: 'Featured Deals',
    },

    // Common UI Text
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      retry: 'Try Again',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      more: 'More',
      less: 'Less',
      showAll: 'Show All',
      showLess: 'Show Less',
      readMore: 'Read More',
      readLess: 'Read Less',
      learnMore: 'Learn More',
      getStarted: 'Get Started',
      contact: 'Contact',
      support: 'Support',
      help: 'Help',
      faq: 'FAQ',
      about: 'About',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Settings',
    },

    // Form Labels
    forms: {
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      name: 'Name',
      phone: 'Phone Number',
      address: 'Address',
      city: 'City',
      country: 'Country',
      postalCode: 'Postal Code',
      required: 'Required',
      optional: 'Optional',
      submit: 'Submit',
      reset: 'Reset',
      clear: 'Clear',
    },

    // Error Messages
    errors: {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      passwordTooShort: 'Password must be at least 8 characters',
      passwordMismatch: 'Passwords do not match',
      networkError: 'Network error. Please check your connection.',
      serverError: 'Server error. Please try again later.',
      notFound: 'Page not found',
      unauthorized: 'Unauthorized access',
      forbidden: 'Access forbidden',
      validation: 'Please check your input',
      uploadFailed: 'Upload failed',
      fileTooLarge: 'File is too large',
      unsupportedFormat: 'Unsupported file format',
    },

    // Success Messages
    success: {
      saved: 'Saved successfully',
      updated: 'Updated successfully',
      deleted: 'Deleted successfully',
      sent: 'Sent successfully',
      uploaded: 'Uploaded successfully',
      registered: 'Registration successful',
      loggedIn: 'Logged in successfully',
      loggedOut: 'Logged out successfully',
      passwordChanged: 'Password changed successfully',
      emailVerified: 'Email verified successfully',
    },

    // Shopping & E-commerce
    shopping: {
      price: 'Price',
      comparePrice: 'Compare Price',
      bestPrice: 'Best Price',
      lowestPrice: 'Lowest Price',
      priceRange: 'Price Range',
      currency: '$',
      addToCart: 'Add to Cart',
      addToWishlist: 'Add to Wishlist',
      removeFromWishlist: 'Remove from Wishlist',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      limitedStock: 'Limited Stock',
      freeShipping: 'Free Shipping',
      fastDelivery: 'Fast Delivery',
      rating: 'Rating',
      reviews: 'Reviews',
      review: 'Review',
      writeReview: 'Write a Review',
      specifications: 'Specifications',
      description: 'Description',
      features: 'Features',
      brand: 'Brand',
      model: 'Model',
      color: 'Color',
      size: 'Size',
      weight: 'Weight',
      dimensions: 'Dimensions',
      warranty: 'Warranty',
    },

    // Filter & Sort
    filters: {
      filter: 'Filter',
      sort: 'Sort',
      sortBy: 'Sort By',
      priceAsc: 'Price: Low to High',
      priceDesc: 'Price: High to Low',
      newest: 'Newest',
      oldest: 'Oldest',
      popular: 'Most Popular',
      rating: 'Highest Rated',
      relevance: 'Relevance',
      clearFilters: 'Clear Filters',
      applyFilters: 'Apply Filters',
      showResults: 'Show Results',
      noResults: 'No results found',
      resultsFound: 'results found',
    },

    // Navigation & Layout
    navigation: {
      home: 'Home',
      products: 'Products',
      deals: 'Deals',
      brands: 'Brands',
      stores: 'Stores',
      blog: 'Blog',
      news: 'News',
      contact: 'Contact Us',
      sitemap: 'Sitemap',
      breadcrumb: 'You are here',
    },

    // Footer

    footerDisclaimer: {
      text1:
        'All prices in Euro incl. VAT, plus shipping if applicable. Prices, ranking, delivery times, and shipping costs may change in the meantime. Delivery times are in working days (Mon–Fri, excluding holidays).',
      text2:
        'We publish consumer reviews (product opinions) on our site. No check has been made to determine whether these come from consumers who have actually used or purchased the reviewed item, unless the review is marked as “verified opinion.” More information can be found on the respective product detail page.',
    },

    mobileAppPromotion: {
      title: 'Bring the idealo price comparison to your smartphone!',
      appStoreAlt: 'Download on the App Store',
      googlePlayAlt: 'Get it on Google Play',
    },

    qualitySustainability: {
      title: 'Quality and Sustainability',
      climateNeutral: 'Climate-neutral company',
      certifiedPortal: 'Certified comparison portal',
      moreInfo: 'More info',
      climateSealAlt: 'TÜV Climate Neutral',
      tuevSealAlt: "Certificate - TÜV Saarland - certified comparison portal 'Price comparison' 06/2024",
    },

    Produktdetails: "Product Details",


    "topCategories": {
      "title": "Our Top Categories"
    },
    "singleCategory": {
      "gaming": {
        "title": "Gaming & Play",
        "ps4Controller": "PS4 Controller",
        "pokemonPrismCards": "Pokémon Prismatic Evolutions Trading Cards",
        "pokemonCards": "Pokémon Cards",
        "switchController": "Switch Controller",
        "xboxController": "Xbox One Controller",
        "tonieFigures": "Tonie Figures",
        "nintendoGames": "Nintendo Switch Games",
        "legoStarWars": "LEGO Star Wars",
        "jellycatToys": "Jellycat Plush Toys"
      },
      "fashion": {
        "title": "Fashion & Accessories",
        "samsonite": "Samsonite Suitcases",
        "adidasSneakers": "Adidas Sneakers",
        "longchamp": "Longchamp Handbags",
        "calvinBoxers": "Calvin Klein Boxers",
        "onitsukaSneakers": "Onitsuka Tiger Sneakers",
        "pandoraBracelets": "Pandora Bracelets",
        "skechersSlipons": "Skechers Slip-ons"
      },
      "foodDrink": {
        "title": "Food & Drinks",
        "dolceGusto": "Dolce Gusto Capsules",
        "desperados": "Desperados Beer",
        "tanqueray": "Tanqueray Gin",
        "absolut": "Absolut Vodka",
        "donPapa": "Don Papa Rum",
        "threeSixty": "Three Sixty Vodka"
      },
      "homeGarden": {
        "title": "Home & Garden",
        "makita": "Makita Power Tool Batteries",
        "poolCovers": "Round Pool Covers",
        "outdoorRugs": "Outdoor Rugs",
        "stokkeChairs": "Stokke High Chairs",
        "acUnits": "Air Conditioners with Exhaust Hose",
        "euroPallets": "Euro Pallets",
        "dysonPurifier": "Dyson Air Purifiers",
        "lotusGrill": "LotusGrill BBQs",
        "einhellMower": "Einhell Cordless Lawnmowers",
        "lafumaChairs": "Lafuma Reclining Chairs",
        "fansQuiet": "Quiet Fans",
        "gasBottles": "Gas Bottles",
        "einhellBatteries": "Einhell Tool Batteries",
        "hensslerPans": "Henssler Pans"
      }
    },

    companyInfo: {
      title: 'idealo – The No. 1 in Price Comparison',
      transparency: {
        title: 'Transparency for you',
        text: 'It is important to us that you always feel good when shopping. Our task is to create transparency among millions of online offers. We want to enable you to decide what you really need in order to make the best purchase decision. Our biggest concern is to support you while shopping. We don’t need to sell you anything and have no warehouse to clear out. That’s why we always advise you objectively. The merchants listed with us pay us a small fee for our service. For you, the use of idealo is free. And it will stay that way.',
      },
      possibilities: {
        title: 'Endless Possibilities',
        text: 'Over 560 million offers from around 50,000 retailers in our price comparison mean a comprehensive overview of the market for you. Whatever you are looking for, we surely have it. At the best price. Extensive filter and sorting functions help you find your personal offer. Test reports, user opinions, and our guides help you with your purchase decision. Wish lists and price alerts make shopping cheap and convenient. You decide what and from whom you want to buy. On the go, you can use our app.',
      },
      awards: {
        title: 'Award-Winning',
        text: 'We are pretty good at what we do and constantly win awards for our reliability and service. In addition, TÜV Saarland awarded us as the first price comparison site with the "Certified Comparison Portal" seal for transparency, up-to-dateness, data protection, and quality (06/2023). We are very pleased that TÜV certified our work as a price comparison site. Nevertheless, around 1,000 employees from over 60 nations work every day to make your shopping easy, worry-free, and safe, and to continuously improve idealo.',
      },
    },

    trendingNow: {
      heading: "Trending Now",
      wlanAmplifier: "WiFi Amplifier",
      womensJacketsCoats: "Women's Jackets & Coats",
      outdoorJackets: "Outdoor Jackets",
      electricHeaters: "Electric Heaters",
      mensJacketsCoats: "Men's Jackets & Coats",
      rubberBoots: "Rubber Boots",
      outdoorHeaters: "Outdoor Heaters",
      fireplacesStoves: "Fireplaces & Stoves",
      kidsOveralls: "Kids' Overalls",
      kidsJacketsCoats: "Kids' Jackets & Coats",
    },

    matchingProducts: {
      heading: "Matching Products",
      from: "from",
      schoolCone: "School Cone",
      kidsSportsBag: "Kids' Sports Bag",
      schoolBackpack: "School Backpack",
      schoolBagSet: "School Bag Set",
      kidsDesk: "Kids' Desk",
      pencilCase: "Pencil Case",
      gymBag: "Gym Bag",
      kidsBottle: "Kids' Water Bottle",
    },

    matching: {
      matching: 'Matching Categories',
      PencilCases: "Pencil Cases",
      ChildrenTables: "Children’s Tables",
      WaterBottles: "Water Bottles",
      SportsBags: "Sports Bags",
      SchoolBags: "School Bags",
      SchoolCones: "School Cones"
    },

    schoolPromotion: {
      heading: 'Everything for School!',
      cta: 'Discover Now',
    },

    bestsellers: {
      heading: 'Discover the Bestsellers',
      badge: 'Bestseller',
      from: 'from',
    },

    newsletter: {
      heading: 'Get idealo Deals, Promotions & News by Email',
      cta: 'Sign up for Newsletter',
    },
    deals: {
      heading: "Current Deals for You",
      cta: "View All Deals",
    },

    heroCircles: {
      dealOfDay: 'Deal of the Day',
      backToSchool: 'Back to School',
      newPixel: 'New Pixel',
    },

    productOverview: "Product Overview",
    similarProducts: "Similar Products",
    bestPrice: "Best Price",
    offers: "Offers",
    showMoreOffers: "Show More Offers",
    priceHistory: "Price History",
    youSaveToday: "You Save Today",
    compare: "Compare",
    insteadOf: "Instead of",
    ninetyDayAveragePrice: "Average Best Price Over 90 Days",
    price: "Price",
    setPriceAlert: "Set Price Alert",
    priceComparison: "Price Comparison",
    shopAndRating: "Shop & Rating",
    delivery: "Delivery",
    paymentMethods: "Payment Methods",
    priceAndShipping: "Price & Shipping",
    offerName: "Offer Name",
    goToShop: "Go to Shop",
    satisfactionSurvey: "How satisfied are you with the price comparison",
    generalSpecifications: "General Specifications",
    collapseDetails: "Show Less Details",
    expandDetails: "View All Details",
    shopDetails: "Shop Details",
    Additionalinformationabouttheshop: "Additional information about the shop",
    andtheoffer: "and the offer",
    Condition: "Condition",
    Showmoreoffers: "Show more offers",
    Thankyouforyourfeedback: "Thank you for your feedback"
  },

  ar: {
    // Header Component - Arabic
    header: {
      navigation: {
        shopping: 'التسوق',
        flight: 'الطيران',
        magazine: 'المجلة',
      },
      sustainability: 'الاستدامة',
      search: {
        placeholder: 'أبحث عن ...',
        categories: 'الفئات',
        searchButton: 'بحث',
      },
      userActions: {
        wishlist: 'قائمة الأماني',
        priceAlert: 'تنبيه السعر',
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب',
        account: 'حسابي',
        logout: 'تسجيل الخروج',
      },
      skipLinks: {
        main: 'الانتقال إلى المحتوى الرئيسي',
        navigation: 'الانتقال إلى التنقل',
        search: 'الانتقال إلى البحث',
      },
      anniversary: {
        years: 'سنة',
        celebrating: 'نحتفل بـ',
      },
    },

    "landing": {
      "hero": {
        "title": "منتجات شائعة",
        "badge": "مُميّز",
        "bannerAlt": "لافتة الحملة",
        "bannerTitle": "اختيارات خاصة",
        "bannerCta": "قريباً"
      },
      "newsletter": {
        "title": "احصل على العروض والأخبار عبر البريد",
        "cta": "اشترك في النشرة"
      },
      "carousel": {
        "badge": "مُميّز"
      },
      "common": {
        "from": "ابتداءً من",
        "rating": "التقييم",
        "reviews": "المراجعات",
        "wishlist": "المفضلة",
        "comingSoon": "قريباً",
        "prev": "السابق",
        "next": "التالي"
      }
    },

    "footer": {
      "brand": "سبس فراز",
      "ctaLine": "قارن العروض بين المتاجر واعثر على أفضل سعر.",

      "about": "من نحن",
      "sustainability": "الاستدامة",
      "press": "الصحافة",
      "jobs": "الوظائف",
      "blog": "المدونة",

      "shopping": "التسوق",
      "comparePrices": "مقارنة الأسعار",

      "support": "خدمة العملاء",
      "help": "مركز المساعدة",
      "contact": "تواصل معنا",

      "business": "الأعمال",
      "retailers": "التجار",
      "partners": "الشركاء",
      "registerShop": "تسجيل متجر",
      "affiliates": "برنامج الشركاء",

      "follow": "تابعنا",
      "newsletter": "النشرة البريدية",
      "instagram": "إنستغرام",
      "facebook": "فيسبوك",
      "youtube": "يوتيوب",

      "imprint": "بيانات الموقع",
      "privacy": "الخصوصية",
      "terms": "الشروط",
      "cookies": "ملفات تعريف الارتباط"
    },


    categoryBar: {
      "ariaLabel": "شريط الفئات",
      "prev": "السابق",
      "next": "التالي",
      "disabled": "غير متاح",
      "items": {
        "deals": "عروض",
        "electronics": "إلكترونيات",
        "sport": "رياضة وخارجية",
        "baby": "الأطفال",
        "home": "المنزل والحديقة",
        "food": "طعام وشراب",
        "gaming": "ألعاب",
        "health": "صحة وجمال",
        "auto": "سيارات",
        "fashion": "موضة وإكسسوارات",
        "pets": "مستلزمات الحيوانات",
        "flight": "رحلات"
      }
    },

    // Category Navigation - Arabic
    categories: {
      deals: 'العروض المميزة',
      electronics: 'الإلكترونيات',
      sportsOutdoor: 'الرياضة والهواء الطلق',
      babyKids: 'الأطفال والرضع',
      homeGarden: 'المنزل والحديقة',
      foodDrink: 'الطعام والشراب',
      gaming: 'الألعاب والترفيه',
      health: 'الصحة والجمال',
      automotive: 'السيارات والدراجات',
      fashion: 'الموضة والإكسسوارات',
      pets: 'مستلزمات الحيوانات',
      flight: 'الطيران',
      all: 'جميع الفئات',
      popular: 'الفئات الشائعة',
    },

    // Main Hero Banner - Arabic
    hero: {
      tagline: 'عرضك المميز، إعجابك الحقيقي:',
      cta: 'اكتشف الآن',
      subtitle: 'اعثر على أفضل العروض وقارن الأسعار',
      featured: 'العروض المميزة',
    },

    // Common UI Text - Arabic
    common: {
      loading: 'جاري التحميل...',
      error: 'حدث خطأ ما',
      retry: 'حاول مرة أخرى',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      save: 'حفظ',
      edit: 'تعديل',
      delete: 'حذف',
      close: 'إغلاق',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      more: 'المزيد',
      less: 'أقل',
      showAll: 'عرض الكل',
      showLess: 'عرض أقل',
      readMore: 'اقرأ المزيد',
      readLess: 'اقرأ أقل',
      learnMore: 'تعلم المزيد',
      getStarted: 'ابدأ الآن',
      contact: 'اتصل بنا',
      support: 'الدعم',
      help: 'المساعدة',
      faq: 'الأسئلة الشائعة',
      about: 'حول',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      cookies: 'إعدادات ملفات تعريف الارتباط',
    },

    // Form Labels - Arabic
    forms: {
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      name: 'الاسم',
      phone: 'رقم الهاتف',
      address: 'العنوان',
      city: 'المدينة',
      country: 'الدولة',
      postalCode: 'الرمز البريدي',
      required: 'مطلوب',
      optional: 'اختياري',
      submit: 'إرسال',
      reset: 'إعادة تعيين',
      clear: 'مسح',
    },

    // Error Messages - Arabic
    errors: {
      required: 'هذا الحقل مطلوب',
      invalidEmail: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
      passwordTooShort: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      networkError: 'خطأ في الشبكة. يرجى التحقق من اتصالك.',
      serverError: 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
      notFound: 'الصفحة غير موجودة',
      unauthorized: 'وصول غير مصرح به',
      forbidden: 'الوصول محظور',
      validation: 'يرجى التحقق من المدخلات',
      uploadFailed: 'فشل في الرفع',
      fileTooLarge: 'الملف كبير جداً',
      unsupportedFormat: 'تنسيق الملف غير مدعوم',
    },

    // Success Messages - Arabic
    success: {
      saved: 'تم الحفظ بنجاح',
      updated: 'تم التحديث بنجاح',
      deleted: 'تم الحذف بنجاح',
      sent: 'تم الإرسال بنجاح',
      uploaded: 'تم الرفع بنجاح',
      registered: 'تم التسجيل بنجاح',
      loggedIn: 'تم تسجيل الدخول بنجاح',
      loggedOut: 'تم تسجيل الخروج بنجاح',
      passwordChanged: 'تم تغيير كلمة المرور بنجاح',
      emailVerified: 'تم التحقق من البريد الإلكتروني بنجاح',
    },

    // Shopping & E-commerce - Arabic
    shopping: {
      price: 'السعر',
      comparePrice: 'مقارنة الأسعار',
      bestPrice: 'أفضل سعر',
      lowestPrice: 'أقل سعر',
      priceRange: 'نطاق السعر',
      currency: 'ر.س',
      addToCart: 'أضف إلى السلة',
      addToWishlist: 'أضف إلى المفضلة',
      removeFromWishlist: 'إزالة من المفضلة',
      inStock: 'متوفر',
      outOfStock: 'غير متوفر',
      limitedStock: 'مخزون محدود',
      freeShipping: 'شحن مجاني',
      fastDelivery: 'توصيل سريع',
      rating: 'التقييم',
      reviews: 'المراجعات',
      review: 'مراجعة',
      writeReview: 'اكتب مراجعة',
      specifications: 'المواصفات',
      description: 'الوصف',
      features: 'المميزات',
      brand: 'العلامة التجارية',
      model: 'الموديل',
      color: 'اللون',
      size: 'المقاس',
      weight: 'الوزن',
      dimensions: 'الأبعاد',
      warranty: 'الضمان',
    },

    // Filter & Sort - Arabic
    filters: {
      filter: 'تصفية',
      sort: 'ترتيب',
      sortBy: 'ترتيب حسب',
      priceAsc: 'السعر: من الأقل إلى الأعلى',
      priceDesc: 'السعر: من الأعلى إلى الأقل',
      newest: 'الأحدث',
      oldest: 'الأقدم',
      popular: 'الأكثر شعبية',
      rating: 'الأعلى تقييماً',
      relevance: 'الصلة',
      clearFilters: 'مسح التصفية',
      applyFilters: 'تطبيق التصفية',
      showResults: 'عرض النتائج',
      noResults: 'لم يتم العثور على نتائج',
      resultsFound: 'نتيجة',
    },

    // Navigation & Layout - Arabic
    navigation: {
      home: 'الرئيسية',
      products: 'المنتجات',
      deals: 'العروض',
      brands: 'العلامات التجارية',
      stores: 'المتاجر',
      blog: 'المدونة',
      news: 'الأخبار',
      contact: 'اتصل بنا',
      sitemap: 'خريطة الموقع',
      breadcrumb: 'أنت هنا',
    },

    footerDisclaimer: {
      text1:
        'جميع الأسعار باليورو شاملة ضريبة القيمة المضافة، وقد تُضاف رسوم الشحن عند الاقتضاء. قد تتغير الأسعار، الترتيب، أوقات التسليم وتكاليف الشحن بمرور الوقت. أوقات التسليم بالأيام (من الاثنين إلى الجمعة باستثناء العطل الرسمية).',
      text2:
        'ننشر على موقعنا تقييمات من المستهلكين (آراء المنتجات). لم يتم التحقق مما إذا كانت هذه التقييمات من مستهلكين قاموا فعلاً باستخدام أو شراء المنتج المُقيّم، ما لم يتم الإشارة إلى أن التقييم هو "رأي موثوق". يمكن العثور على مزيد من المعلومات في صفحة تفاصيل المنتج المعني.',
    },
    mobileAppPromotion: {
      title: 'اجلب مقارنة الأسعار من idealo إلى هاتفك الذكي!',
      appStoreAlt: 'تحميل من متجر التطبيقات',
      googlePlayAlt: 'الحصول عليه من جوجل بلاي',
    },
    qualitySustainability: {
      title: 'الجودة والاستدامة',
      climateNeutral: 'شركة محايدة مناخياً',
      certifiedPortal: 'بوابة مقارنة معتمدة',
      moreInfo: 'مزيد من المعلومات',
      climateSealAlt: 'شهادة TÜV الحياد المناخي',
      tuevSealAlt: "شهادة - TÜV Saarland - بوابة مقارنة معتمدة 'مقارنة الأسعار' 06/2024",
    },
    Produktdetails: "تفاصيل المنتج",
    "topCategories": {
      "title": "أفضل فئاتنا"
    },
    "singleCategory": {
      "gaming": {
        "title": "الألعاب والترفيه",
        "ps4Controller": "وحدة تحكم PS4",
        "pokemonPrismCards": "بطاقات بوكيمون التطورات البراقة",
        "pokemonCards": "بطاقات بوكيمون",
        "switchController": "وحدة تحكم سويتش",
        "xboxController": "وحدة تحكم إكس بوكس ون",
        "tonieFigures": "شخصيات توني",
        "nintendoGames": "ألعاب نينتندو سويتش",
        "legoStarWars": "ليغو حرب النجوم",
        "jellycatToys": "دمى جيلي كات المحشوة"
      },
      "fashion": {
        "title": "الموضة والإكسسوارات",
        "samsonite": "حقائب سامسونايت",
        "adidasSneakers": "أحذية أديداس الرياضية",
        "longchamp": "حقائب لونغشامب",
        "calvinBoxers": "بوكسرات كالفن كلاين",
        "onitsukaSneakers": "أحذية أونيتسوكا تايغر",
        "pandoraBracelets": "أساور باندورا",
        "skechersSlipons": "أحذية سكيشرز السهلة الارتداء"
      },
      "foodDrink": {
        "title": "الطعام والشراب",
        "dolceGusto": "كبسولات دولتشي غوستو",
        "desperados": "بيرة ديسبيرادوس",
        "tanqueray": "جن تانكويراي",
        "absolut": "فودكا أبسولوت",
        "donPapa": "روم دون بابا",
        "threeSixty": "فودكا ثري سيكستي"
      },
      "homeGarden": {
        "title": "المنزل والحديقة",
        "makita": "بطاريات أدوات ماكيتا",
        "poolCovers": "أغطية المسابح الدائرية",
        "outdoorRugs": "سجاد خارجي",
        "stokkeChairs": "كراسي ستوكه العالية",
        "acUnits": "مكيفات هواء بأنبوب عادم",
        "euroPallets": "المنصات الأوروبية",
        "dysonPurifier": "منقّيات الهواء دايسون",
        "lotusGrill": "شوايات لوتس جريل",
        "einhellMower": "جزازات عشب إينهل اللاسلكية",
        "lafumaChairs": "كراسي لا فاما القابلة للاستلقاء",
        "fansQuiet": "مراوح هادئة",
        "gasBottles": "أسطوانات غاز",
        "einhellBatteries": "بطاريات أدوات إينهل",
        "hensslerPans": "مقالي هينسلر"
      },
      flights: {
        heading: "Travel cheaper with idealo",
        toDeals: "Go to Flight Deals",
        showMore: "Show more routes",
      },
    },

    companyInfo: {
      title: 'idealo – رقم 1 في مقارنة الأسعار',
      transparency: {
        title: 'الشفافية من أجلك',
        text: 'من المهم بالنسبة لنا أن تشعر دائمًا بالراحة عند التسوق. مهمتنا هي خلق الشفافية بين ملايين العروض عبر الإنترنت. نريد تمكينك من اتخاذ القرار الصحيح ومعرفة ما تحتاجه حقًا من أجل اتخاذ أفضل قرار شراء. أهم أولوياتنا هي دعمك أثناء التسوق. نحن لا نحتاج إلى بيع أي شيء لك ولا نملك مخزنًا يجب تفريغه. لذلك نقدم لك دائمًا نصائح موضوعية. التجار المدرجون لدينا يدفعون لنا رسومًا صغيرة مقابل خدمتنا. بالنسبة لك، فإن استخدام idealo مجاني. وسيبقى كذلك.',
      },
      possibilities: {
        title: 'إمكانيات لا نهائية',
        text: 'أكثر من 560 مليون عرض من حوالي 50,000 متجر في مقارنة الأسعار الخاصة بنا تعني لك نظرة شاملة على السوق. مهما كنت تبحث عنه، فمن المؤكد أننا نملكه. وبأفضل سعر. تساعدك خيارات التصفية والفرز الشاملة في العثور على العرض المناسب لك. تقارير الاختبارات وآراء المستخدمين ونصائحنا الإرشادية تساعدك في اتخاذ قرار الشراء. تجعل القوائم والرصد السعري عملية التسوق مريحة وسهلة. أنت تقرر ما الذي تريد شراءه ومن أين. أثناء التنقل يمكنك استخدام تطبيقنا.',
      },
      awards: {
        title: 'حاصلون على جوائز',
        text: 'نحن جيدون جدًا في ما نقوم به ونفوز باستمرار بجوائز عن موثوقيتنا وخدماتنا. بالإضافة إلى ذلك، منحتنا TÜV Saarland لقب أول موقع لمقارنة الأسعار يحمل ختم "بوابة مقارنة معتمدة" للجودة والشفافية وحماية البيانات وحداثة المعلومات (06/2023). نحن سعداء جدًا بحصول عملنا على شهادة TÜV كموقع مقارنة أسعار. ومع ذلك، يعمل حوالي 1,000 موظف من أكثر من 60 دولة يوميًا لجعل تسوقك سهلاً وخاليًا من القلق وآمنًا، ولتحسين idealo باستمرار.',
      },
    },
    flights: {
      heading: "سافر بأرخص الأسعار مع idealo",
      toDeals: "اذهب إلى عروض الطيران",
      showMore: "عرض المزيد من المسارات",
    },
    trendingNow: {
      heading: "الأكثر رواجًا الآن",
      wlanAmplifier: "مضخم الواي فاي",
      womensJacketsCoats: "سترات ومعاطف نسائية",
      outdoorJackets: "سترات خارجية",
      electricHeaters: "مدافئ كهربائية",
      mensJacketsCoats: "سترات ومعاطف رجالية",
      rubberBoots: "أحذية مطاطية",
      outdoorHeaters: "مدافئ خارجية",
      fireplacesStoves: "مدافئ وأفران",
      kidsOveralls: "أفرولات للأطفال",
      kidsJacketsCoats: "سترات ومعاطف للأطفال",
    },
    matchingProducts: {
      heading: "منتجات متطابقة",
      from: "ابتداءً من",
      schoolCone: "مخروط المدرسة",
      kidsSportsBag: "حقيبة رياضية للأطفال",
      schoolBackpack: "حقيبة ظهر مدرسية",
      schoolBagSet: "طقم حقيبة مدرسية",
      kidsDesk: "مكتب أطفال",
      pencilCase: "علبة أقلام",
      gymBag: "حقيبة رياضية",
      kidsBottle: "زجاجة ماء للأطفال",
    },
    matching: {
      matching: 'فئات متطابقة',
      PencilCases: 'علب أقلام',
      ChildrenTables: 'طاولات الأطفال',
      WaterBottles: 'زجاجات ماء',
      SportsBags: 'حقائب رياضية',
      SchoolBags: 'حقائب مدرسية',
      SchoolCones: 'أقماع مدرسية'
    },
    schoolPromotion: {
      heading: 'كل ما تحتاجه للمدرسة!',
      cta: 'اكتشف الآن',
    },
    bestsellers: {
      heading: 'اكتشف الأكثر مبيعًا',
      badge: 'الأكثر مبيعًا',
      from: 'ابتداءً من',
    },
    newsletter: {
      heading: 'احصل على عروض وخصومات وأخبار idealo عبر البريد الإلكتروني',
      cta: 'اشترك في النشرة الإخبارية',
    },
    deals: {
      heading: "العروض الحالية لك",
      cta: "عرض جميع العروض",
    },
    heroCircles: {
      dealOfDay: 'عرض اليوم',
      backToSchool: 'العودة إلى المدرسة',
      anniversary: '٢٥ سنة مع idealo ✨',
      newPixel: 'بيكسل الجديد',
    },
    productOverview: "نظرة عامة على المنتج",
    similarProducts: "منتجات مشابهة",
    bestPrice: "أفضل سعر",
    offers: "العروض",
    showMoreOffers: "عرض المزيد من العروض",
    priceHistory: "تاريخ السعر",
    youSaveToday: "أنت توفر اليوم",
    compare: "قارن",
    insteadOf: "بدلاً من",
    ninetyDayAveragePrice: "متوسط ​​أفضل سعر خلال 90 يومًا",
    price: "السعر",
    setPriceAlert: "تعيين تنبيه السعر",
    priceComparison: "مقارنة الأسعار",
    shopAndRating: "المتجر والتقييم",
    delivery: "التوصيل",
    paymentMethods: "طرق الدفع",
    priceAndShipping: "السعر والشحن",
    offerName: "اسم العرض",
    goToShop: "اذهب إلى المتجر",
    satisfactionSurvey: "ما مدى رضاك عن مقارنة الأسعار؟",
    generalSpecifications: "المواصفات العامة",
    collapseDetails: "عرض تفاصيل أقل",
    expandDetails: "عرض جميع التفاصيل",
    shopDetails: "تفاصيل المتجر",
    Additionalinformationabouttheshop: "معلومات إضافية عن المتجر",
    andtheoffer: "والعرض",
    Condition: "حالة",
    Showmoreoffers: "عرض المزيد من العروض",
    Thankyouforyourfeedback: "شكرا لك على ملاحظاتك"
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