import React from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { IoMdSearch } from "react-icons/io";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [query, setQuery] = React.useState(
    searchParams.get("query")?.toString() ?? "",
  );

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="flex h-[48px] w-full items-start justify-between rounded-lg border-2 border-input bg-white px-4 py-3">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-transparent outline-none"
        onChange={(e) => setQuery(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(query);
          }
        }}
      />
      <IoMdSearch
        className="cursor-pointer text-xl text-gray-400 hover:text-gray-800"
        onClick={() => handleSearch(query)}
      />
    </div>
  );
}
