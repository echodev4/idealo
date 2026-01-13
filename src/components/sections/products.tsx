import Image from "next/image";
import { Heart } from "lucide-react";
import Link from "next/link";

export interface Product {
    _id: string;
    product_url: string;
    source: string;
    product_name: string;
    price: string;
    old_price?: string;
    discount?: string;
    image_url: string;
    reviews?: string;
    average_rating?: number | null;
    created_at?: string;
    updated_at?: string;

    // derived (frontend-only)
    numericPrice?: number;
    numericOldPrice?: number;
}

/* ======================
   PRODUCT CARD
====================== */

const ProductCard = ({ product }: { product: Product }) => {
    if (
        !product ||
        !product.product_url ||
        !product.image_url ||
        !product.product_name ||
        !product.source
    ) {
        return null;
    }

    const encodedUrl = encodeURIComponent(product.product_url);

    return (
        <Link
            href={`/product/${encodedUrl}?product_name=${encodeURIComponent(
                product.product_name
            )}&source=${encodeURIComponent(product.source)}`}
            className="block group cursor-pointer text-inherit no-underline hover:no-underline"
        >
            <div className="relative bg-card border border-border rounded-lg p-4 flex flex-col h-full shadow-sm hover:shadow-lg transition-shadow duration-200">
                <button className="absolute top-3 right-3 z-10 p-1.5 border border-border rounded-full bg-white group-hover:border-primary">
                    <Heart className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                </button>

                <div className="flex items-center gap-1.5">
                    {product.discount && (
                        <span className="bg-accent text-accent-foreground text-sm font-bold px-1.5 py-0.5 rounded-sm">
                            {product.discount}
                        </span>
                    )}
                </div>

                <div className="relative h-48 w-full mx-auto my-3">
                    <Image
                        src={product.image_url}
                        alt={product.product_name}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, (max-width: 1280px) 22vw, 18vw"
                        className="object-contain"
                    />
                </div>

                <div className="flex flex-col flex-grow">
                    <p className="text-xs text-muted-foreground">
                        {product.source}
                    </p>

                    <h3 className="text-sm font-semibold text-gray-text mt-1 flex-grow h-14 overflow-hidden">
                        {product.product_name}
                    </h3>

                    <div className="mt-2 pt-2 border-t border-border">
                        <span className="text-muted-foreground text-sm">from  </span>
                        <span className="text-price text-foreground">
                            AED {product.numericPrice}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

/* ======================
   PRODUCTS GRID
====================== */

export default function Products({
    products,
    landingPage,
}: {
    products: Product[];
    landingPage?: boolean;
}) {
    return (
        <section className={landingPage ? "bg-secondary py-8" : ""}>
            <div className={`container ${landingPage ? "mx-auto px-4" : ""}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
