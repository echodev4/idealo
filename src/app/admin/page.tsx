import { Suspense } from "react";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <Suspense fallback={<div>Loading...</div>}>
                <AdminLoginForm />
            </Suspense>
        </div>
    );
}
