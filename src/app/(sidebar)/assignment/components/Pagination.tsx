import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  meta: {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export default function Pagination({ meta }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <nav className="flex flex-row gap-3">
      <p>Total {meta.totalCount} Items</p>
      <ul className="flex h-6 items-center gap-3 -space-x-px text-base">
        <li>
          <Link
            href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
            className="flex h-6 items-center justify-center rounded-md bg-[#EE1192] px-2 text-white"
          >
            <span className="sr-only">Previous</span>
            <svg
              className="h-2 w-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </Link>
        </li>
        {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
          (page) => (
            <li key={page}>
              <Link
                href={createPageURL(page)}
                className={`flex h-6 items-center justify-center rounded-md px-2 text-[#EE1192] ${
                  currentPage === page
                    ? "bg-[#EE1192] text-white"
                    : "bg-white text-[#EE1192]"
                }`}
              >
                {page}
              </Link>
            </li>
          ),
        )}
        <li>
          <Link
            href={
              currentPage < meta.totalPages
                ? createPageURL(currentPage + 1)
                : "#"
            }
            className="flex h-6 items-center justify-center rounded-md bg-[#EE1192] px-2 text-white"
          >
            <span className="sr-only">Next</span>
            <svg
              className="h-2 w-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </Link>
        </li>
      </ul>
      <p className="rounded-md border px-3.5 text-center">
        <span className="text-gray-500">{meta.pageSize}</span> / page
      </p>
    </nav>
  );
}
