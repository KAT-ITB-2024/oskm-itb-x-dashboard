import { IoMdSearch } from "react-icons/io";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
}: SearchBarProps) {
  return (
    <div className="flex w-full items-center justify-between rounded-lg border-2 border-input bg-white px-6 py-3">
      <input
        type="text"
        placeholder="Cari Event"
        className="w-full bg-transparent outline-none"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <IoMdSearch className="text-xl text-gray-400" />
    </div>
  );
}
