import { useLanguage } from "@/contexts/language-context";
import Products from "./products";
import ProductCardSkeleton from "./skeleton-product-card";

export interface Product {
  _id: string;
  product_url: string;
  source: string;
  product_name: string;
  image_url: string;
  price: string;
  old_price?: string;
  discount?: string;
  reviews?: string;
  average_rating?: number | null;
  created_at?: string;
  updated_at?: string;

  // derived (frontend-only)
  numericPrice?: number;
  numericOldPrice?: number;
}

type CurrentDealsProps = {
  products: Product[];
  loading: boolean;
};

export default function CurrentDeals_({ products, loading }: CurrentDealsProps) {
  const { t } = useLanguage();

  return (
    <section className="bg-background py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-text mb-6">
          {t("deals.heading")}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <Products products={products} landingPage={true} />
        )}
      </div>
    </section>
  );
}
