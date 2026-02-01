import { HTMLAttributes, forwardRef } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "success" | "warning" | "error" | "info" | "admin" | "convener" | "staff";
    size?: "sm" | "md";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className = "", variant = "default", size = "md", children, ...props }, ref) => {
        const baseStyles = "inline-flex items-center font-medium rounded-full transition-colors";

        const sizes = {
            sm: "text-xs px-2 py-0.5",
            md: "text-sm px-2.5 py-1",
        };

        const variants = {
            default: "bg-slate-100 text-slate-700 border border-slate-200",
            success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
            warning: "bg-amber-50 text-amber-700 border border-amber-200",
            error: "bg-red-50 text-red-700 border border-red-200",
            info: "bg-blue-50 text-blue-700 border border-blue-200",
            admin: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
            convener: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white",
            staff: "bg-gradient-to-r from-slate-500 to-slate-600 text-white",
        };

        return (
            <span
                ref={ref}
                className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = "Badge";

export default Badge;
