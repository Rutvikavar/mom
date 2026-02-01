"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/login");
            return;
        }

        const user = JSON.parse(storedUser);

        // Redirect based on role
        switch (user.role) {
            case "admin":
                router.replace("/dashboard/admin");
                break;
            case "meeting_convener":
                router.replace("/dashboard/convener");
                break;
            case "staff":
                router.replace("/dashboard/staff");
                break;
            default:
                router.push("/login");
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-indigo-600 font-medium">
                Redirecting to your dashboard...
            </div>
        </div>
    );
}
