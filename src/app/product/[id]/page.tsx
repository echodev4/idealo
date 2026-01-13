export const dynamic = "force-dynamic";

import ProductComparisonPage from "../ProductComparisonPage";
import "./index.css";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ product_name?: string, source?: string }>;
}

export default async function ProductOfferPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const productUrl = decodeURIComponent(id);

  const sp = (await searchParams) || {};
  const productName = sp.product_name ? decodeURIComponent(sp.product_name) : "";
  const sourceName = sp.source ? decodeURIComponent(sp.source) : "";

  return (
    <ProductComparisonPage
      productUrl={productUrl}
      productName={productName}
      sourceName={sourceName}
    />
  );
}
