interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getPaginationGroup = () => {
    const start = Math.floor((currentPage - 1) / 5) * 5;
    return new Array(5)
      .fill(0)
      .map((_, idx) => start + idx + 1)
      .filter((page) => page <= totalPages);
  };

  return (
    <nav className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <ul className="flex h-6 items-center gap-3 -space-x-px text-base">
          <li>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
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
            </button>
          </li>
          {getPaginationGroup().map((page) => (
            <li key={page}>
              <button
                onClick={() => onPageChange(page)}
                aria-current={currentPage === page ? "page" : undefined}
                className={`flex h-6 items-center justify-center rounded-md px-2 ${
                  currentPage === page
                    ? "bg-[#EE1192] text-white"
                    : "border border-[#EE1192] bg-white text-[#EE1192]"
                }`}
              >
                {page}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
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
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
