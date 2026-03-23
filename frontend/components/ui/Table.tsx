"use client";

import { HTMLAttributes, forwardRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Table Container
interface TableProps extends HTMLAttributes<HTMLTableElement> { }

const Table = forwardRef<HTMLTableElement, TableProps>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table
                    ref={ref}
                    className={`w-full text-sm ${className}`}
                    {...props}
                >
                    {children}
                </table>
            </div>
        );
    }
);
Table.displayName = "Table";

// Table Header
interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> { }

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <thead
                ref={ref}
                className={`bg-slate-50 border-b border-slate-200 ${className}`}
                {...props}
            >
                {children}
            </thead>
        );
    }
);
TableHeader.displayName = "TableHeader";

// Table Body
interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> { }

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <tbody ref={ref} className={`divide-y divide-slate-100 ${className}`} {...props}>
                {children}
            </tbody>
        );
    }
);
TableBody.displayName = "TableBody";

// Table Row
interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
    hover?: boolean;
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
    ({ className = "", hover = true, children, ...props }, ref) => {
        return (
            <tr
                ref={ref}
                className={`${hover ? "hover:bg-slate-50/80 hover:-translate-y-[1px] transition-all duration-200 hover:shadow-sm relative z-0 hover:z-10" : ""} ${className}`}
                {...props}
            >
                {children}
            </tr>
        );
    }
);
TableRow.displayName = "TableRow";

// Table Head Cell
interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> { }

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <th
                ref={ref}
                className={`px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider ${className}`}
                {...props}
            >
                {children}
            </th>
        );
    }
);
TableHead.displayName = "TableHead";

// Table Cell
interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> { }

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <td
                ref={ref}
                className={`px-4 py-3 text-slate-700 ${className}`}
                {...props}
            >
                {children}
            </td>
        );
    }
);
TableCell.displayName = "TableCell";

// Pagination Component
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-white">
            <div className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                ? "bg-indigo-600 text-white"
                                : "hover:bg-slate-100 text-slate-600"
                                }`}
                        >
                            {page}
                        </button>
                    );
                })}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Pagination };
