"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";
import { GiAlliedStar } from "react-icons/gi";
import { IoMdCalendar } from "react-icons/io";
import { MdAssignment, MdGroup, MdOutlineAssignment } from "react-icons/md";

export default function Sidebar() {
  const pathname = usePathname();

  console.log(pathname);

  return (
    <>
      <div className="flex h-full w-[90px] flex-col items-center rounded-2xl bg-[#0010A4] py-10">
        <Image
          src={"/sidebar/logo-sidebar.svg"}
          width={77}
          height={90}
          alt="Logo Sidebar"
        />

        <div className="mt-10 gap-0">
          <Link
            href={"/assignment"}
            className="flex aspect-square w-28 cursor-pointer items-center justify-center rounded-full bg-[url('/sidebar/bg-sidebar-item.svg')] bg-cover bg-no-repeat"
          >
            <MdAssignment
              size={32}
              className={`mt-12 ${pathname.startsWith("/assignment") ? "text-pink-500" : "text-black"}`}
            />
          </Link>

          <Link
            href={"/attendance"}
            className="flex aspect-square w-28 cursor-pointer items-center justify-center rounded-full bg-[url('/sidebar/bg-sidebar-item.svg')] bg-cover bg-no-repeat"
          >
            <IoMdCalendar
              size={32}
              className={`mt-12 ${pathname.startsWith("/attendance") ? "text-pink-500" : "text-black"}`}
            />
          </Link>

          <Link
            href={"/group-information"}
            className="flex aspect-square w-28 cursor-pointer items-center justify-center rounded-full bg-[url('/sidebar/bg-sidebar-item.svg')] bg-cover bg-no-repeat"
          >
            <MdGroup
              size={32}
              className={`mt-12 ${pathname.startsWith("/group-information") ? "text-pink-500" : "text-black"}`}
            />
          </Link>

          <Link
            href={"/cms"}
            className="flex aspect-square w-28 cursor-pointer items-center justify-center rounded-full bg-[url('/sidebar/bg-sidebar-item.svg')] bg-cover bg-no-repeat"
          >
            <MdOutlineAssignment
              size={32}
              className={`mt-12 ${pathname.startsWith("/cms") ? "text-pink-500" : "text-black"}`}
            />
          </Link>

          <Link
            href={"/gather-points"}
            className="flex aspect-square w-28 cursor-pointer items-center justify-center rounded-full bg-[url('/sidebar/bg-sidebar-item.svg')] bg-cover bg-no-repeat"
          >
            <GiAlliedStar
              size={32}
              className={`mt-12 ${pathname.startsWith("/gather-points") ? "text-pink-500" : "text-black"}`}
            />
          </Link>
          <Link
            href={"/merchandise"}
            className="flex aspect-square w-28 cursor-pointer items-center justify-center rounded-full bg-[url('/sidebar/bg-sidebar-item.svg')] bg-cover bg-no-repeat"
          >
            <FaShoppingCart
              size={26}
              className={`mt-12 ${pathname.startsWith("/merchandise") ? "text-pink-500" : "text-black"}`}
            />
          </Link>
        </div>
      </div>
      <Image
        src={"/sidebar/bg-sidebar.svg"}
        width={88}
        height={32}
        alt="Icon Home"
        className="absolute top-16"
      />
    </>
  );
}
