"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiLogOut } from "react-icons/bi";
import { FaShoppingCart } from "react-icons/fa";
import { GiAlliedStar } from "react-icons/gi";
import { IoMdCalendar } from "react-icons/io";
import { MdAssignment, MdGroup } from "react-icons/md";

const sidebarItems = [
  {
    name: "Assignment",
    href: "/assignment",
    icon: MdAssignment,
  },
  {
    name: "Attendance",
    href: "/attendance",
    icon: IoMdCalendar,
  },
  {
    name: "Group",
    href: "/group-information",
    icon: MdGroup,
  },
  {
    name: "Gather Points",
    href: "/gather-points",
    icon: GiAlliedStar,
  },
  {
    name: "Merchandise",
    href: "/merchandise",
    icon: FaShoppingCart,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="relative flex h-[87vh] w-[6rem] flex-col items-center justify-between overflow-hidden rounded-2xl bg-[#0010A4] p-5 transition-all duration-500 ease-in-out hover:w-[20rem]">
      <div className="relative h-[3.5rem] w-[3.5rem] self-start">
        <Image
          src={"/sidebar/logo-sidebar.svg"}
          fill
          objectFit="cover"
          alt="Logo Sidebar"
          className="h-full w-full"
        />
      </div>

      <div className="z-50 flex w-[20rem] flex-col gap-5 self-start">
        {sidebarItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-10"
          >
            <div className="flex h-[3.5rem] w-[3.5rem] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-pink-50 bg-gradient-to-r from-[#f7eab6] to-[#fcc5c1]">
              <item.icon
                size={32}
                className={`${pathname.startsWith(item.href) ? "text-pink-500" : "text-black"}`}
              />
            </div>
            <p
              className={`${pathname.startsWith(item.href) ? "font-semibold" : ""} text-xl text-[#FEFDA3]`}
            >
              {item.name}
            </p>
          </Link>
        ))}
      </div>

      <div className="flex w-[20rem] cursor-pointer flex-col gap-4 self-start">
        <div className="flex items-center gap-10">
          <div className="flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-pink-50 bg-gradient-to-r from-[#f7eab6] to-[#fcc5c1]">
            <BiLogOut
              size={32}
              className={`text-red-500 transition-all duration-100 ease-in-out`}
            />
          </div>
          <p className="text-xl font-semibold text-red-400">Log Out</p>
        </div>
      </div>
      <div className="absolute left-0 top-0 w-[20rem] rounded-full">
        <Image
          src={"/sidebar/bubble.png"}
          width={150}
          height={32}
          alt="Icon Home"
          className="absolute left-0 top-0 w-[12rem]"
        />
      </div>
      <div className="absolute bottom-1/3 left-0 h-10 w-[20rem] rounded-full">
        <Image
          src={"/sidebar/seaweed.png"}
          width={150}
          height={32}
          alt="Icon Home"
          className="absolute right-0 top-0 w-[8rem]"
        />
      </div>
    </div>
  );
}