import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ExternalLink, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export interface Product {
    _id?: string;
    source?: string;

    product_name?: string;
    image_url?: string;
    price?: string;

    offerCount?: number;

    title?: string;
    currentPrice?: string;
    images?: { src: string; alt?: string }[];

    product_url: string;

    numericPrice?: number;

    overview?: string;
    highlights?: string[];
    specifications?: Record<string, string>;

    ratingCount?: string;
    numericOldPrice?: number;

    scraped_at?: any;
}

function formatPriceAED(value?: number) {
    const n = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(n)) return "";
    return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function getName(p: Product) {
    return p.title || p.product_name || "";
}

function getImg(p: Product) {
    return p.images?.[0]?.src || p.image_url || "";
}

function getSource(p: Product) {
    return (p.source || "noon").toLowerCase();
}

function getProductHref(p: Product) {
    const name = getName(p);
    const source = getSource(p);
    const encodedUrl = encodeURIComponent(p.product_url);
    return `/product/${encodedUrl}?product_name=${encodeURIComponent(name)}&source=${encodeURIComponent(source)}`;
}

function ProductCellGrid({ product }: { product: Product }) {
    const { t } = useLanguage();
    const name = getName(product);
    const img = getImg(product);
    const source = getSource(product);

    if (!product?.product_url || !name || !img) return null;

    const href = getProductHref(product);

    return (
        <div className="relative h-full bg-white px-4 pb-5 pt-4 sm:px-5 sm:pb-6">
            <button
                type="button"
                className="absolute right-4 top-4 z-10 hidden h-10 w-10 place-items-center rounded-full border border-gray-300 bg-white text-[#0b63c8] cursor-not-allowed sm:grid"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <Heart className="h-5 w-5" />
            </button>

            <Link href={href} className="block">
                <div className="relative mx-auto mt-8 h-[170px] w-full max-w-[230px]">
                    <Image
                        src={img}
                        alt={name}
                        fill
                        sizes="(max-width: 640px) 46vw, (max-width: 1024px) 28vw, (max-width: 1280px) 22vw, 18vw"
                        className="object-contain"
                    />
                </div>
            </Link>

            <div className="mt-5">
                {/* <div className="text-[12px] text-gray-500">{source}</div> */}

                <Link href={href} className="mt-1 block">
                    <div className="line-clamp-3 min-h-[54px] text-[13px] font-semibold leading-[18px] text-gray-900 hover:underline">
                        {name}
                    </div>
                </Link>

                <div className="mt-3">
                    <span className="text-[12px] text-gray-700">{t("category.products.from", "from")} </span>
                    <span className="text-[16px] font-semibold text-[#ff6a00]">
                        AED {formatPriceAED(product.numericPrice)}
                    </span>
                </div>


                {typeof product.offerCount === "number" && product.offerCount > 0 ? (
                    <div className="mt-1 text-[12px] text-[#1a73e8] font-medium">
                        {product.offerCount} {product.offerCount === 1 ? "offer available" : "offers available"}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function ProductRowList({ product, onOpenDetails }: { product: Product; onOpenDetails: () => void }) {
    const { t } = useLanguage();
    const name = getName(product);
    const img = getImg(product);
    const source = getSource(product);

    if (!product?.product_url || !name || !img) return null;

    const href = getProductHref(product);

    return (
        <div className="relative bg-white px-4 py-4 sm:px-5">
            <div className="flex items-start gap-4">
                <Link href={href} className="shrink-0">
                    <div className="relative h-[92px] w-[92px] overflow-hidden rounded bg-white">
                        <Image src={img} alt={name} fill className="object-contain p-1" sizes="92px" />
                    </div>
                </Link>

                <div className="min-w-0 flex-1">
                    <Link href={href} className="block">
                        <div className="text-[14px] font-semibold leading-5 text-gray-900 hover:underline line-clamp-2">
                            {name}
                        </div>
                    </Link>
                    <div className="mt-1 text-[12px] text-gray-600 line-clamp-2 cursor-not-allowed">
                        {t("category.products.placeholderDescription", "Ski helmet, all-round, in-mold, with side impact protection (MIPS)")}
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onOpenDetails();
                        }}
                        className="mt-2 inline-flex items-center gap-2 text-[13px] font-medium text-[#0b63c8] hover:underline"
                    >
                        <ExternalLink className="h-4 w-4" />
                        {t("category.products.productDetailsButton", "Product details")}
                    </button>
                </div>

                <div className="hidden sm:flex w-[180px] flex-col items-end justify-center gap-2 pr-1">
                    {/* <div className="text-[12px] text-gray-500">{source}</div> */}
                    <div className="text-right">
                        <div className="text-[12px] text-gray-700">{t("category.products.from", "from")}</div>
                        <div className="text-[18px] font-semibold text-[#ff6a00]">
                            AED {formatPriceAED(product.numericPrice)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between sm:hidden">
                {/* <div className="text-[12px] text-gray-500">{source}</div> */}
                <div className="text-right">
                    <span className="text-[12px] text-gray-700">{t("category.products.from", "from")} </span>
                    <span className="text-[16px] font-semibold text-[#ff6a00]">
                        AED {formatPriceAED(product.numericPrice)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function Products({
    products,
    view = "grid",
}: {
    products: Product[];
    view?: "grid" | "list";
}) {
    const safeProducts = useMemo(
        () => products.filter((p) => p?.product_url && getName(p) && getImg(p)),
        [products]
    );

    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const openDetails = (idx: number) => {
        setActiveIndex(idx);
        setOpen(true);
    };

    return (
        <div>
            {view === "grid" ? (
                <div className="w-full bg-[#cfd6dd] p-px">
                    <div className="grid grid-cols-2 gap-px sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {safeProducts.map((product, idx) => (
                            <div key={product._id ?? product.product_url ?? idx} className="bg-white">
                                <ProductCellGrid product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full bg-[#cfd6dd] p-px">
                    <div className="flex flex-col gap-px">
                        {safeProducts.map((product, idx) => (
                            <div key={product._id ?? product.product_url ?? idx} className="bg-white">
                                <ProductRowList product={product} onOpenDetails={() => openDetails(idx)} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}