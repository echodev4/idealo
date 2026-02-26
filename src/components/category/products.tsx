import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Heart, Star, X } from "lucide-react";

export interface Product {
    _id?: string;
    source?: string;

    product_name?: string;
    image_url?: string;
    price?: string;

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

function StarsDisabled({ className = "" }: { className?: string }) {
    return (
        <div className={`inline-flex items-center gap-0.5 ${className}`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 text-gray-300" fill="currentColor" />
            ))}
        </div>
    );
}

function ProductDetailsModal({
    open,
    onClose,
    products,
    activeIndex,
    onNavigateIndex,
}: {
    open: boolean;
    onClose: () => void;
    products: Product[];
    activeIndex: number;
    onNavigateIndex: (idx: number) => void;
}) {
    const active = products[activeIndex];
    const otherRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    if (!open || !active) return null;

    const img = getImg(active);
    const name = getName(active);
    const href = getProductHref(active);

    const highlights = Array.isArray(active.highlights) ? active.highlights : [];
    const specs = active.specifications && typeof active.specifications === "object" ? active.specifications : {};
    const specEntries = Object.entries(specs);

    const scrollOther = (dir: "left" | "right") => {
        const el = otherRef.current;
        if (!el) return;
        const amount = Math.round(el.clientWidth * 0.85);
        el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 px-3 py-6">
            <div className="relative flex h-[82vh] max-h-[82vh] w-full max-w-[980px] flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
                <div className="relative shrink-0 border-b border-gray-200 px-6 py-4">
                    <div className="text-center text-[18px] font-semibold text-gray-900">Product details</div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="px-6 py-5">
                        <div className="rounded-md bg-[#f7f7f7] p-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                <div className="relative h-[92px] w-[92px] shrink-0 overflow-hidden rounded bg-white">
                                    <Image src={img} alt={name} fill className="object-contain p-2" sizes="92px" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <Link href={href} className="block max-w-full truncate text-[16px] font-semibold text-gray-900 hover:underline">
                                                {name}
                                            </Link>


                                        </div>

                                        <button
                                            type="button"
                                            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gray-200 bg-white text-[#0b63c8] cursor-not-allowed"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                        >
                                            <Heart className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center rounded bg-[#0b63c8] px-3 py-2 text-[13px] font-semibold text-white cursor-not-allowed"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                        >
                                            from&nbsp;AED&nbsp;{formatPriceAED(active.numericPrice)}
                                        </button>

                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 text-[13px] font-medium text-[#0b63c8] cursor-not-allowed"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                        >
                                            Show offers <span>→</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {active.overview ? (
                            <div className="mt-5">
                                <div className="text-[15px] font-semibold text-gray-900">Overview</div>
                                <div className="mt-2 text-[13px] leading-6 text-gray-700">{active.overview}</div>
                            </div>
                        ) : null}

                        {highlights.length ? (
                            <div className="mt-5">
                                <div className="text-[15px] font-semibold text-gray-900">Highlights</div>
                                <div className="mt-3 space-y-2">
                                    {highlights.slice(0, 12).map((h, i) => (
                                        <div key={i} className="text-[13px] leading-6 text-gray-700">
                                            • {h}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        <div className="mt-6">
                            <div className="flex items-center gap-2">
                                <div className="text-[15px] font-semibold text-gray-900">Conclusion of the editorial team</div>
                                <button
                                    type="button"
                                    className="inline-flex items-center text-[13px] font-medium text-[#0b63c8] cursor-not-allowed"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                >
                                    Show <span className="ml-1">›</span>
                                </button>
                            </div>

                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
                                    <div className="text-[14px] font-semibold text-gray-900">Advantages</div>
                                    <div className="mt-3 space-y-2 text-[13px] leading-6 text-gray-700">
                                        <div className="flex gap-2">
                                            <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">+</span>
                                            <span className="cursor-not-allowed">Not available</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">+</span>
                                            <span className="cursor-not-allowed">Not available</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-md border border-rose-200 bg-rose-50 p-4">
                                    <div className="text-[14px] font-semibold text-gray-900">Disadvantages</div>
                                    <div className="mt-3 space-y-2 text-[13px] leading-6 text-gray-700">
                                        <div className="flex gap-2">
                                            <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700">–</span>
                                            <span className="cursor-not-allowed">Not available</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700">–</span>
                                            <span className="cursor-not-allowed">Not available</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="text-[15px] font-semibold text-gray-900">Product details</div>
                            <div className="mt-3 overflow-hidden rounded-md bg-[#f3f3f3]">
                                {specEntries.length ? (
                                    <div className="divide-y divide-white">
                                        {specEntries.slice(0, 26).map(([k, v]) => (
                                            <div key={k} className="grid grid-cols-2 gap-3 px-4 py-2 text-[13px]">
                                                <div className="text-gray-500">{k}</div>
                                                <div className="text-gray-800">{String(v)}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="px-4 py-3 text-[13px] text-gray-600 cursor-not-allowed">No specifications available</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="shrink-0 border-t border-gray-200 bg-white px-5 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => scrollOther("left")}
                            className="grid h-10 w-10 place-items-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div className="text-center text-[12px] text-gray-500">Other products</div>

                        <button
                            type="button"
                            onClick={() => scrollOther("right")}
                            className="grid h-10 w-10 place-items-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>

                    <div ref={otherRef} className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {products.map((p, idx) => {
                            const n = getName(p);
                            const im = getImg(p);
                            if (!n || !im) return null;
                            const isActive = idx === activeIndex;

                            return (
                                <button
                                    key={p._id ?? p.product_url ?? idx}
                                    type="button"
                                    onClick={() => onNavigateIndex(idx)}
                                    className={`relative w-[168px] shrink-0 rounded-md border bg-white p-3 text-left ${isActive ? "border-[#0b63c8]" : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="relative mx-auto h-[92px] w-full">
                                        <Image src={im} alt={n} fill className="object-contain" sizes="168px" />
                                    </div>
                                    <div className="mt-2 line-clamp-2 text-[12px] font-semibold text-gray-900">{n}</div>
                                    <div className="mt-2 text-[12px] text-gray-600">
                                        from <span className="font-semibold text-[#ff6a00]">AED {formatPriceAED(p.numericPrice)}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProductCellGrid({ product, onOpenDetails }: { product: Product; onOpenDetails: () => void }) {
    const name = getName(product);
    const img = getImg(product);
    const source = getSource(product);

    if (!product?.product_url || !name || !img) return null;

    const href = getProductHref(product);

    return (
        <div className="relative h-full bg-white px-4 pb-5 pt-4 sm:px-5 sm:pb-6">
            <button
                type="button"
                className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-gray-300 bg-white text-[#0b63c8] cursor-not-allowed"
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
                <div className="text-[12px] text-gray-500">{source}</div>

                <Link href={href} className="mt-1 block">
                    <div className="line-clamp-3 min-h-[54px] text-[13px] font-semibold leading-[18px] text-gray-900 hover:underline">
                        {name}
                    </div>
                </Link>



                <div className="mt-3">
                    <span className="text-[12px] text-gray-700">from </span>
                    <span className="text-[16px] font-semibold text-[#ff6a00]">AED {formatPriceAED(product.numericPrice)}</span>
                </div>

                <div className="mt-3">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onOpenDetails();
                        }}
                        className="inline-flex items-center gap-2 text-[13px] font-medium text-[#0b63c8] hover:underline"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Product details
                    </button>
                </div>
            </div>
        </div>
    );
}

function ProductRowList({ product, onOpenDetails }: { product: Product; onOpenDetails: () => void }) {
    const name = getName(product);
    const img = getImg(product);
    const source = getSource(product);

    if (!product?.product_url || !name || !img) return null;

    const href = getProductHref(product);

    return (
        <div className="relative bg-white px-4 py-4 sm:px-5">
            <button
                type="button"
                className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-gray-300 bg-white text-[#0b63c8] cursor-not-allowed"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <Heart className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4">
                <Link href={href} className="shrink-0">
                    <div className="relative h-[92px] w-[92px] overflow-hidden rounded bg-white">
                        <Image src={img} alt={name} fill className="object-contain p-1" sizes="92px" />
                    </div>
                </Link>

                <div className="min-w-0 flex-1">
                    <Link href={href} className="block">
                        <div className="text-[14px] font-semibold leading-5 text-gray-900 hover:underline line-clamp-2">{name}</div>
                    </Link>
                    <div className="mt-1 text-[12px] text-gray-600 line-clamp-2 cursor-not-allowed">
                        Ski helmet, all-round, in-mold, with side impact protection (MIPS)
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
                        Product details
                    </button>
                </div>

                <div className="hidden sm:flex w-[180px] flex-col items-end justify-center gap-2 pr-1">
                    <div className="text-[12px] text-gray-500">{source}</div>
                    <div className="text-right">
                        <div className="text-[12px] text-gray-700">from</div>
                        <div className="text-[18px] font-semibold text-[#ff6a00]">AED {formatPriceAED(product.numericPrice)}</div>
                    </div>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between sm:hidden">
                <div className="text-[12px] text-gray-500">{source}</div>
                <div className="text-right">
                    <span className="text-[12px] text-gray-700">from </span>
                    <span className="text-[16px] font-semibold text-[#ff6a00]">AED {formatPriceAED(product.numericPrice)}</span>
                </div>
            </div>
        </div>
    );
}

export default function Products({
    products,
    landingPage,
    view = "grid",
}: {
    products: Product[];
    landingPage?: boolean;
    view?: "grid" | "list";
}) {
    const safeProducts = useMemo(() => products.filter((p) => p?.product_url && getName(p) && getImg(p)), [products]);

    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const openDetails = (idx: number) => {
        setActiveIndex(idx);
        setOpen(true);
    };

    const close = () => setOpen(false);

    const navigateIndex = (idx: number) => {
        if (idx < 0 || idx >= safeProducts.length) return;
        setActiveIndex(idx);
    };

    return (
        <section className={landingPage ? "bg-secondary py-8" : ""}>
            <div className={`container ${landingPage ? "mx-auto px-4" : ""}`}>
                {view === "grid" ? (
                    <div className="w-full bg-[#cfd6dd] p-px">
                        <div className="grid grid-cols-2 gap-px sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {safeProducts.map((product, idx) => (
                                <div key={product._id ?? product.product_url ?? idx} className="bg-white">
                                    <ProductCellGrid product={product} onOpenDetails={() => openDetails(idx)} />
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

                <ProductDetailsModal open={open} onClose={close} products={safeProducts} activeIndex={activeIndex} onNavigateIndex={navigateIndex} />
            </div>
        </section>
    );
}