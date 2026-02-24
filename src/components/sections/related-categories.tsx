import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

type Product = {
  _id: string;
  product_url: string;
  source: string;
  product_name: string;
  image_url: string;
  price: string;
};

export default function RelatedCategories({
  products,
  loading,
}: {
  products: Product[];
  loading: boolean;
}) {
  const { t } = useLanguage();

  const categories = [
    {
      title: t("landing.relatedCats.cat1", "Winter jackets"),
      image:
        "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c4edb08b-0b16-4a29-bec7-c89ea14040c9-idealo-de/assets/images/the-north-face-boys-reversible-perrito-hooded-jack-19.jpg",
    },
    {
      title: t("landing.relatedCats.cat2", "Thermal underwear"),
      image:
        "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c4edb08b-0b16-4a29-bec7-c89ea14040c9-idealo-de/assets/images/XL_NEWandXXL_NEW_544_767be007-308d-4fdc-a491-014d8-28.jpg",
    },
    {
      title: t("landing.relatedCats.cat3", "Ski gear"),
      image:
        "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c4edb08b-0b16-4a29-bec7-c89ea14040c9-idealo-de/assets/images/mittelgross-4.jpg",
    },
  ];

  // Use a large promo asset here (this one is small and gets upscaled easily on desktop)
  const promoImage =
    "https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=1400&q=90";

  return (
    <section className="bg-[var(--background)] home-band">
      <div className="container">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8">
            <div className="mb-8">
              <h2 className="text-[20px] font-bold text-[#000000] mb-4">
                {t("landing.relatedCats.title", "Related categories")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="flex items-center justify-between card-idealo p-3 hover:no-underline transition-shadow cursor-not-allowed"
                    aria-disabled="true"
                    title={t("landing.common.comingSoon", "Coming soon")}
                  >
                    <span className="text-[14px] font-product-name text-[#212121] truncate pr-2">
                      {cat.title}
                    </span>

                    <div className="w-[60px] h-[60px] relative flex-shrink-0">
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        sizes="60px"
                        className="object-contain"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-[20px] font-bold text-[#000000] mb-4">
                {t("landing.relatedProducts.title", "Related products")}
              </h2>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="card-idealo p-3 animate-pulse">
                      <div className="w-full aspect-square bg-[#F1F3F5] rounded mb-3" />
                      <div className="h-3 w-24 bg-[#E9ECEF] rounded mb-2" />
                      <div className="h-4 w-full bg-[#E9ECEF] rounded mb-2" />
                      <div className="h-4 w-4/5 bg-[#E9ECEF] rounded mb-4" />
                      <div className="h-5 w-24 bg-[#E9ECEF] rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {(products || []).map((prod) => {
                    const encodedUrl = encodeURIComponent(prod.product_url);

                    return (
                      <div
                        key={prod._id ?? prod.product_url}
                        className="card-idealo p-3 flex flex-col relative group"
                      >
                        <button
                          className="absolute top-2 right-2 z-10 p-1 text-[#666666] hover:text-[#212121]"
                          aria-label={t("landing.common.wishlist", "Wishlist")}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <Heart size={20} />
                        </button>

                        <Link
                          href={`/product/${encodedUrl}?product_name=${encodeURIComponent(
                            prod.product_name
                          )}&source=${encodeURIComponent(prod.source)}`}
                          className="flex flex-col h-full hover:no-underline"
                        >
                          <div className="w-full aspect-square relative mb-3">
                            <Image
                              src={prod.image_url}
                              alt={prod.product_name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-contain p-2"
                            />
                          </div>

                          <div className="flex-grow">
                            <span className="block text-[12px] text-[#666666] mb-1 leading-tight">
                              {prod.source}
                            </span>

                            <h3 className="text-[14px] font-product-name text-[#212121] leading-[1.4] mb-4 line-clamp-2">
                              {prod.product_name}
                            </h3>
                          </div>

                          <div className="mt-auto">
                            <span className="text-[16px] font-bold text-[#212121]">
                              <span className="text-[12px] font-normal mr-1">
                                {t("landing.common.from", "from")}
                              </span>
                              {prod.price}
                            </span>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="hidden xl:block xl:col-span-4">
            <div className="card-idealo p-0 overflow-hidden h-full min-h-[520px] relative">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/c4edb08b-0b16-4a29-bec7-c89ea14040c9-idealo-de/assets/images/XL_NEWandXXL_NEW_544_767be007-308d-4fdc-a491-014d8-28.jpg"
                alt="Ab auf die Piste"
                fill
                sizes="33vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/10 flex flex-col justify-end p-8">
                <div
                  className="bg-[var(--color-link)] text-white inline-block px-4 py-2 text-[24px] font-bold transform -rotate-2 w-fit mb-4 cursor-not-allowed"
                  title={t("landing.common.comingSoon", "Coming soon")}
                >
                  {t("landing.promo.title", "PROMO")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}