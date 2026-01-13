import AdminShell from "@/components/admin/AdminShell";
import CardForm from "@/components/admin/CardForm";
import { connectDB } from "@/lib/mongodb";
import { CardManagement } from "@/models/CardManagement";
import type { AdminCard } from "@/types/admin-card";
import mongoose from "mongoose";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCardPage({ params }: PageProps) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return (
      <AdminShell>
        <div className="rounded-md border bg-white p-6">Invalid ID</div>
      </AdminShell>
    );
  }

  await connectDB();

  const doc = await CardManagement.findById(id).lean();

  const item = doc
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

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold text-gray-900">Edit Card</h1>
      <div className="mt-5">
        {item ? (
          <CardForm mode="edit" id={id} initial={item} />
        ) : (
          <div className="rounded-md border bg-white p-6">Not found</div>
        )}
      </div>
    </AdminShell>
  );
}
