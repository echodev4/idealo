import AdminShell from "@/components/admin/AdminShell";
import CardForm from "@/components/admin/CardForm";

export default function NewCardPage() {
    return (
        <AdminShell>
            <h1 className="text-2xl font-semibold text-gray-900">Add Card</h1>
            <div className="mt-5">
                <CardForm mode="create" />
            </div>
        </AdminShell>
    );
}
