"use client";

import { forwardRef } from "react";
import { Calendar } from "lucide-react";

interface DatePickerProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    includeTime?: boolean;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
    ({ label, value, onChange, error, includeTime = false }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="block text-sm font-medium text-slate-700 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                        ref={ref}
                        type={includeTime ? "datetime-local" : "date"}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`
              w-full bg-white border rounded-xl py-2.5 pl-10 pr-4 text-slate-900
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
              transition-all duration-200
              ${error ? "border-red-300 focus:ring-red-500/50 focus:border-red-500" : "border-slate-200"}
            `}
                    />
                </div>
                {error && <p className="text-sm text-red-500 ml-1">{error}</p>}
            </div>
        );
    }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
