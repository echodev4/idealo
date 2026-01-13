import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    // ======================
    // Identity
    // ======================
    source: { type: String },           // e.g. noon, carrefouruae, sharafdg
    product_url: { type: String },      // unique per source

    // ======================
    // Core searchable fields
    // ======================
    product_name: { type: String },
    image_url: { type: String },

    // ======================
    // Pricing
    // ======================
    price: { type: String },            // keep as string (currency varies)
    old_price: { type: String, default: null },
    discount: { type: String, default: null },

    // ======================
    // Ratings
    // ======================
    average_rating: { type: String, default: null },
    reviews: { type: String, default: null },

    // ======================
    // Categorization / metadata
    // ======================
    category: { type: String, default: null },
    source_url: { type: String },

    scraped_at: { type: Date },
    embedded_at: { type: Date },

    // ======================
    // Embedding (NOT indexed)
    // ======================
    embedding: { type: [Number] },
  },
  {
    timestamps: false,
    strict: false, // allow future fields without migrations
  }
);

/**
 * ❌ IMPORTANT
 * DO NOT define text / compound indexes here.
 * They are already created directly in MongoDB.
 *
 * MongoDB indexes (source of truth):
 *  - product_name text index
 *  - source + product_url unique index
 *  - source index
 *  - scraped_at index
 */

export function getProductModel(collectionName: string) {
  const modelName = `Product_${collectionName}`;
  return (
    mongoose.models[modelName] ||
    mongoose.model(modelName, productSchema, collectionName)
  );
}
