export type RawProduct = {
  _id?: string;
  source?: string;
  product_url?: string;
  title?: string;
  product_name?: string;
  currentPrice?: string | number;
  previousPrice?: string | number;
  price?: string | number;
  old_price?: string | number;
  discount?: string | number;
  reviews?: string | number;
  average_rating?: number | null;
  rating?: string | number;
  ratingCount?: string | number;
  images?: { src?: string; alt?: string }[];
  image_url?: string;
  category?: string;
  main_category?: string;
  category_path_text?: string;
  scraped_at?: string;
  lastLiveScrapedAt?: string;
  created_at?: string;
  inserted_at?: string;
  faiss_score?: number;
  specifications?: Record<string, unknown>;
};

export type CategoryProduct = {
  _id?: string;
  product_url: string;
  title: string;
  currentPrice: string;
  previousPrice?: string;
  discountPercentage?: string;
  rating?: string;
  ratingCount?: string;
  images: { src: string; alt?: string }[];
  category_path_text?: string;
  category?: string;
  main_category?: string;
  source?: string;
  source_record_id?: string;
  numericPrice?: number;
  numericOldPrice?: number;
  scraped_at?: string;
  offerCount?: number;
  faiss_score?: number;
  specifications?: Record<string, unknown>;
};

export type SearchProductsResult = {
  products: CategoryProduct[];
};

export type PaginatedProductsResult = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  products: CategoryProduct[];
};

export type ProductCase = "mobile" | "unknown";

export type NormalizedMobileSpecs = {
  model: string | null;
  color: string | null;
  ramGb: number | null;
  storageGb: number | null;
};
