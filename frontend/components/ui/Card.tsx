import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "stats" | "gradient";
    hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = "", variant = "default", hover = false, children, ...props }, ref) => {
        const baseStyles = "rounded-2xl p-6 transition-all duration-200";

        const variants = {
            default:
                "glass shadow-lg shadow-slate-200/50",
            stats:
                "glass shadow-lg shadow-slate-200/50 border-l-4",
            gradient:
                "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-100",
        };

        const hoverStyles = hover
            ? "hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 cursor-pointer"
            : "";

        return (
            <div
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

// Card Header Component
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> { }

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`flex items-center gap-3 mb-4 ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

CardHeader.displayName = "CardHeader";

// Card Title Component
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> { }

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={`text-lg font-semibold text-slate-800 ${className}`}
                {...props}
            >
                {children}
            </h3>
        );
    }
);

CardTitle.displayName = "CardTitle";

// Card Content Component
interface CardContentProps extends HTMLAttributes<HTMLDivElement> { }

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <div ref={ref} className={`${className}`} {...props}>
                {children}
            </div>
        );
    }
);

CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
export default Card;
