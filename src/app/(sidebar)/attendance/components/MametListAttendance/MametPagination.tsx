// interface MametPaginationProps {
//   currentPage: number;
//   totalItems: number;
//   itemsPerPage: number;
//   onPageChange: (page: number) => void;
// }

// export default function MametPagination({
//   currentPage,
//   totalItems,
//   itemsPerPage,
//   onPageChange,
// }: MametPaginationProps) {
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const pages: number[] = [...Array(totalPages).keys()].map(n => n + 1);

//   const handlePrevious = () => {
//     if (currentPage > 1) {
//       onPageChange(currentPage - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       onPageChange(currentPage + 1);
//     }
//   };

//   return (
//     <div>
//       <nav className="flex flex-row gap-3">
//         <p>Total {totalItems} Items</p>
//         <ul className="flex h-6 items-center gap-3 -space-x-px text-base">
//           <li>
//             <button
//               onClick={handlePrevious}
//               className={`flex h-6 items-center justify-center rounded-md px-2 text-white ${currentPage === 1 ? "bg-gray-300" : "bg-[#EE1192]"}`}
//               disabled={currentPage === 1}
//             >
//               <span className="sr-only">Previous</span>
//               <svg
//                 className="h-2 w-2 rtl:rotate-180"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 6 10"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M5 1 1 5l4 4"
//                 />
//               </svg>
//             </button>
//           </li>
//           {pages.map((page) => (
//             <li key={page}>
//               <button
//                 onClick={() => onPageChange(page)}
//                 className={`flex h-6 items-center justify-center rounded-md px-2 text-white ${
//                   currentPage === page ? "bg-[#EE1192]" : "bg-gray-300"
//                 }`}
//               >
//                 {page}
//               </button>
//             </li>
//           ))}
//           <li>
//             <button
//               onClick={handleNext}
//               className={`flex h-6 items-center justify-center rounded-md px-2 text-white ${currentPage === totalPages ? "bg-gray-300" : "bg-[#EE1192]"}`}
//               disabled={currentPage === totalPages}
//             >
//               <span className="sr-only">Next</span>
//               <svg
//                 className="h-2 w-2 rtl:rotate-180"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 6 10"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="m1 9 4-4-4-4"
//                 />
//               </svg>
//             </button>
//           </li>
//         </ul>
//         <p className="rounded-md border px-3.5 text-center">
//           <span className="text-gray-500">{itemsPerPage}</span> / page
//         </p>
//       </nav>
//     </div>
//   );
// }

import React from "react";

interface MametPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function MametPagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: MametPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pages: number[] = [...Array(totalPages).keys()].map((n) => n + 1);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div>
      <nav className="flex flex-row gap-3">
        <p>Total {totalItems * 2 } Items</p>
        <ul className="flex h-6 items-center gap-3 -space-x-px text-base">
          <li>
            <button
              onClick={handlePrevious}
              className={`flex h-6 items-center justify-center rounded-md px-2 text-white ${
                currentPage === 1 ? "bg-gray-300" : "bg-[#EE1192]"
              }`}
              disabled={currentPage === 1}
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
          {pages.map((page) => (
            <li key={page}>
              <button
                onClick={() => onPageChange(page)}
                className={`flex h-6 items-center justify-center rounded-md px-2 text-white ${
                  currentPage === page ? "bg-[#EE1192]" : "bg-gray-300"
                }`}
              >
                {page}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={handleNext}
              className={`flex h-6 items-center justify-center rounded-md px-2 text-white ${
                currentPage === totalPages ? "bg-gray-300" : "bg-[#EE1192]"
              }`}
              disabled={currentPage === totalPages}
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
        <p className="rounded-md border px-3.5 text-center">
          <span className="text-gray-500">{itemsPerPage*2}</span> / page
        </p>
      </nav>
    </div>
  );
}
    </div>
  );
}
