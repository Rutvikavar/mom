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
            default: "bg-white/60 text-slate-700 border border-slate-200 backdrop-blur-sm",
            success: "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20",
            warning: "bg-amber-500/10 text-amber-700 border border-amber-500/20",
            error: "bg-red-500/10 text-red-700 border border-red-500/20",
            info: "bg-blue-500/10 text-blue-700 border border-blue-500/20",
            admin: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-sm shadow-red-500/20",
            convener: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm shadow-indigo-500/20",
            staff: "bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-sm shadow-slate-500/20",
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
