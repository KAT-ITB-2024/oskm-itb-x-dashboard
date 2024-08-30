// "use client";

// import React, { useState } from "react";
// import { Input } from "~/components/ui/input";
// import { Button } from "~/components/ui/button";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "~/components/ui/popover";
// import { ChevronsUpDown, Check } from "lucide-react";
// import {
//   Command,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "~/components/ui/command";
// import { cn } from "~/lib/utils";
// import { MdDownload } from "react-icons/md";
// import { MdAdd } from "react-icons/md";

// const days = [
//   {
//     value: "Day 1",
//     label: "Day 1",
//   },
//   {
//     value: "Day 2",
//     label: "Day 2",
//   },
//   {
//     value: "Day 3",
//     label: "Day 3",
//   },
//   {
//     value: "Day 4",
//     label: "Day 4",
//   },
// ];

// interface SearchAndFilterBarProps {
//   onSelectDay: (day: string | null) => void;
//   onDownload: () => void;
// }
// export default function MametNavigation({
//   onSelectDay,
//   onDownload,
// }: SearchAndFilterBarProps) {
//   const [open, setOpen] = useState(false);
//   const [selectedDay, setSelectedDay] = useState<string | null>(null);

//   const handleSelectDay = (day: string) => {
//     if (day === selectedDay) {
//       // Jika hari yang dipilih sudah aktif, hapus filter
//       setSelectedDay(null);
//       onSelectDay(null); // Mengirimkan null untuk menghapus filter
//     } else {
//       // Set hari yang dipilih
//       setSelectedDay(day);
//       onSelectDay(day);
//     }
//     setOpen(false);
//   };

//   return (
//     <div className="flex w-full items-center gap-4">
//       {/* Search Input */}
//       <div className="relative flex w-full items-center">
//         <Input type="text" placeholder="Cari Event..." className="pr-10" />
//         <svg
//           className="absolute right-3 h-5 w-5 text-gray-400"
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M21 21l-4.35-4.35M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z"
//           />
//         </svg>
//       </div>

//       {/* Combobox for Day Filter */}
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             role="combobox"
//             aria-expanded={open}
//             className="flex h-[48px] w-[226px] justify-between"
//           >
//             {selectedDay ?? "Filter Hari"}
//             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-[226px] p-0">
//           <Command>
//             <CommandInput placeholder="Search day..." />
//             <CommandList>
//               <CommandGroup>
//                 {days.map((day) => (
//                   <CommandItem
//                     key={day.value}
//                     value={day.value}
//                     onSelect={() => handleSelectDay(day.value)}
//                   >
//                     <Check
//                       className={cn(
//                         "mr-2 h-4 w-4",
//                         selectedDay === day.value ? "opacity-100" : "opacity-0",
//                       )}
//                     />
//                     {day.label}
//                   </CommandItem>
//                 ))}
//               </CommandGroup>
//             </CommandList>
//           </Command>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { cn } from "~/lib/utils";
import { MdDownload } from "react-icons/md";

const days = [
  {
    value: "Day 1",
    label: "Day 1",
  },
  {
    value: "Day 2",
    label: "Day 2",
  },
  {
    value: "Day 3",
    label: "Day 3",
  },
  {
    value: "Day 4",
    label: "Day 4",
  },
];

interface SearchAndFilterBarProps {
  onSelectDay: (day: string | null) => void;
  onDownload: () => void;
}
export default function MametNavigation({
  onSelectDay,
  onDownload,
}: SearchAndFilterBarProps) {
  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const handleSelectDay = (day: string) => {
    if (day === selectedDay) {
      // Jika hari yang dipilih sudah aktif, hapus filter
      setSelectedDay(null);
      onSelectDay(null); // Mengirimkan null untuk menghapus filter
    } else {
      // Set hari yang dipilih
      setSelectedDay(day);
      onSelectDay(day);
    }
    setOpen(false);
  };

  return (
    <div className="flex w-full items-center gap-4">
      {/* Search Input */}
      <div className="relative flex w-full items-center">
        <Input type="text" placeholder="Cari Event..." className="pr-10" />
        <svg
          className="absolute right-3 h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
      </div>

      {/* Combobox for Day Filter */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex h-[48px] w-[226px] justify-between"
          >
            {selectedDay ?? "Filter Hari"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[226px] p-0">
          <Command>
            <CommandInput placeholder="Search day..." />
            <CommandList>
              <CommandGroup>
                {days.map((day) => (
                  <CommandItem
                    key={day.value}
                    value={day.value}
                    onSelect={() => handleSelectDay(day.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedDay === day.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {day.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Recap Button */}
      <Button
        className="h-[46px] w-[180px] rounded-md bg-[#0010A4] text-white "
        onClick={onDownload}
      >
        <MdDownload className="w-[20px] text-[#3678FF]" color="white" />
        Recap
      </Button>
    </div>
  );
}