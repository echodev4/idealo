import mongoose, { Schema, Model } from "mongoose";

export type CardManagementDoc = {
  bankName: string;
  joiningAnnualFee: string;
  apr: string;
  salaryTransferRequired: boolean;
  welcomeBonus: string;
  earnRates: string;
  keyLifestyleBenefits: string;
  pointsRedemption: string;
  documentsRequired: string;
  cardImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

const CardManagementSchema = new Schema<CardManagementDoc>(
  {
    bankName: { type: String, required: true, trim: true },
    joiningAnnualFee: { type: String, required: true, trim: true },
    apr: { type: String, required: true, trim: true },
    salaryTransferRequired: { type: Boolean, required: true },
    welcomeBonus: { type: String, required: true, trim: true },
    earnRates: { type: String, required: true, trim: true },
    keyLifestyleBenefits: { type: String, required: true, trim: true },
    pointsRedemption: { type: String, required: true, trim: true },
    documentsRequired: { type: String, required: true, trim: true },
    cardImageUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const CardManagement: Model<CardManagementDoc> =
  (mongoose.models.CardManagement as Model<CardManagementDoc>) ||
  mongoose.model<CardManagementDoc>("CardManagement", CardManagementSchema);
