import { Inbox, Search, FileX, Users } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
    type?: "default" | "search" | "meetings" | "users";
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({
    type = "default",
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    const icons = {
        default: <Inbox className="w-12 h-12 text-slate-300" />,
        search: <Search className="w-12 h-12 text-slate-300" />,
        meetings: <FileX className="w-12 h-12 text-slate-300" />,
        users: <Users className="w-12 h-12 text-slate-300" />,
    };

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="p-4 rounded-full bg-slate-100 mb-4">
                {icons[type]}
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
            {actionLabel && onAction && (
                <Button variant="primary" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
