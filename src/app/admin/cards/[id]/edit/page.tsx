import AdminShell from "@/components/admin/AdminShell";
import EditCardPageContent from "@/components/admin/EditCardPageContent";
import { connectDB } from "@/lib/mongodb";
import { CardManagement } from "@/models/CardManagement";
import type { AdminCard } from "@/types/admin-card";
import mongoose from "mongoose";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCardPage({ params }: PageProps) {
  const { id } = await params;
  const invalidId = !mongoose.Types.ObjectId.isValid(id);

  let item: AdminCard | null = null;

  if (!invalidId) {
    await connectDB();

    const doc = await CardManagement.findById(id).lean();

    item = doc
      ? ({
          _id: String(doc._id),
          bankName: doc.bankName,
          joiningAnnualFee: doc.joiningAnnualFee,
          apr: doc.apr,
          salaryTransferRequired: doc.salaryTransferRequired,
          welcomeBonus: doc.welcomeBonus,
          earnRates: doc.earnRates,
          keyLifestyleBenefits: doc.keyLifestyleBenefits,
          pointsRedemption: doc.pointsRedemption,
          documentsRequired: doc.documentsRequired,
          cardImageUrl: doc.cardImageUrl,
        } as AdminCard)
      : null;
  }

  return (
    <AdminShell>
      <EditCardPageContent id={id} item={item} invalidId={invalidId} />
    </AdminShell>
  );
}
