import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';

const MobileAppPromotion = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-secondary">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 py-8 md:flex-row">
        <h3 className="text-center text-xl font-semibold text-foreground md:text-left lg:text-2xl">
          {t('mobileAppPromotion.title')}
        </h3>
        <div className="flex items-center gap-4">
          <a
            href="https://j24y.adj.st/home?adj_t=1d1sbdll_1dosmsb8&adj_campaign=Footer_banners&adj_deep_link=ipc%3A%2F%2Fdeeplink%2Fhome&adj_fallback=https%3A%2F%2Fwww.idealo.de%2Fservices%2Fvorteile%2Fidealo-app&adj_redirect_macos=https%3A%2F%2Fwww.idealo.de%2Fservices%2Fvorteile%2Fidealo-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://cdn.idealo.com/storage/design-system-assets/png/app_logos/appstore_de.png"
              alt={t('mobileAppPromotion.appStoreAlt')}
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </a>
          <a
            href="https://j24y.adj.st/home?adj_t=1d1sbdll_1dosmsb8&adj_campaign=Footer_banners&adj_deep_link=ipc%3A%2F%2Fdeeplink%2Fhome&adj_fallback=https%3A%2F%2Fwww.idealo.de%2Fservices%2Fvorteile%2Fidealo-app&adj_redirect_macos=https%3A%2F%2Fwww.idealo.de%2Fservices%2Fvorteile%2Fidealo-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://cdn.idealo.com/storage/design-system-assets/png/app_logos/playstore_de.png"
              alt={t('mobileAppPromotion.googlePlayAlt')}
              width={135}
              height={40}
              className="h-10 w-auto"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileAppPromotion;
