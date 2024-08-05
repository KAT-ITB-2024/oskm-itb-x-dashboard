"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiLogOut } from "react-icons/bi";
import { FaShoppingCart } from "react-icons/fa";
import { GiAlliedStar } from "react-icons/gi";
import { IoMdCalendar } from "react-icons/io";
import { MdAssignment, MdGroup, MdOutlineAssignment } from "react-icons/md";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="group absolute z-50 flex min-h-screen w-[90px] flex-col items-center rounded-2xl bg-[#0010A4] py-10 transition-all duration-500 ease-in-out hover:w-[300px]">
        <Image
          src={"/sidebar/logo-sidebar.svg"}
          width={77}
          height={90}
          alt="Logo Sidebar"
          className="absolute left-2 top-2"
        />

        <Image
          src={"/sidebar/bg-sidebar.svg"}
          width={90}
          height={32}
          alt="Icon Home"
          className="absolute top-0 transition-all duration-0 ease-in-out group-hover:hidden"
        />

        <Image
          src={"/sidebar/bg-sidebar-logo.svg"}
          width={200}
          height={32}
          alt="Icon Home"
          className="absolute left-0 top-0 hidden transition-all duration-100 ease-in-out group-hover:block"
        />

        <div className="mt-24 w-full space-y-4">
          <Link href={"/assignment"} className="relative flex items-center">
            <div className="flex aspect-square w-28 cursor-pointer items-center justify-center rounded-full bg-[url('/sidebar/bg-sidebar-item.svg')] bg-cover bg-no-repeat">
              <MdAssignment
                size={32}
                className={`mt-10 transition-all duration-100 ease-in-out group-hover:mt-12 ${pathname.startsWith("/assignment") ? "text-pink-500" : "text-black"}`}
              />
            </div>
            <p
              className={`${pathname.startsWith("/assignment") ? "font-semibold" : ""} absolute left-32 ml-2 mt-12 hidden text-xl text-[#FEFDA3] group-hover:flex`}
            >
              Assignment
            </p>
          </Link>

          <Link href={"/attendance"} className="relative flex items-center">
            <div className="flex aspect-square w-28 cursor-pointer items-center justify-center rounded-full bg-[url('/sidebar/bg-sidebar-item.svg')] bg-cover bg-no-repeat">
              <IoMdCalendar
                size={32}
                className={`mt-10 transition-all duration-100 ease-in-out group-hover:mt-12 ${pathname.startsWith("/attendance") ? "text-pink-500" : "text-black"}`}
              />
            </div>
            <p
              className={`absolute ${pathname.startsWith("/attendance") ? "font-semibold" : ""} left-32 ml-2 mt-12 hidden text-xl text-[#FEFDA3] group-hover:flex`}
            >
              Attendance
            </p>
          </Link>

          <Link
            href={"/group-information"}
            className="relative flex items-center"
          >
            <div className="flex aspect-square w-28 cursor-pointer items-center justify-center rounded-full bg-[url('/sidebar/bg-sidebar-item.svg')] bg-cover bg-no-repeat">
              <MdGroup
                size={32}
                className={`mt-10 transition-all duration-100 ease-in-out group-hover:mt-12 ${pathname.startsWith("/group-information") ? "text-pink-500" : "text-black"}`}
              />
            </div>
            <p
              className={`absolute ${pathname.startsWith("/group-information") ? "font-semibold" : ""} left-32 ml-2 mt-12 hidden text-xl text-[#FEFDA3] group-hover:flex`}
            >
              Group Information
            </p>
          </Link>

          <Link href={"/cms"} className="relative flex items-center">
            <div className="flex aspect-square w-28 cursor-pointer items-center justify-center rounded-full bg-[url('/sidebar/bg-sidebar-item.svg')] bg-cover bg-no-repeat">
              <MdOutlineAssignment
                size={32}
                className={`mt-10 transition-all duration-100 ease-in-out group-hover:mt-12 ${pathname.startsWith("/cms") ? "text-pink-500" : "text-black"}`}
              />
            </div>
            <p
              className={`absolute ${pathname.startsWith("/cms") ? "font-semibold" : ""} left-32 ml-2 mt-12 hidden text-xl text-[#FEFDA3] group-hover:flex`}
            >
              CMS
            </p>
          </Link>

          <Link
            href={"/gather-points"}
            className="relative z-50 flex items-center"
          >
            <div className="flex aspect-square w-28 cursor-pointer items-center justify-center rounded-full bg-[url('/sidebar/bg-sidebar-item.svg')] bg-cover bg-no-repeat">
              <GiAlliedStar
                size={32}
                className={`mt-10 transition-all duration-100 ease-in-out group-hover:mt-12 ${pathname.startsWith("/gather-points") ? "text-pink-500" : "text-black"}`}
              />
            </div>
            <p
              className={`absolute ${pathname.startsWith("/gather-points") ? "font-semibold" : ""} left-32 ml-2 mt-12 hidden text-xl text-[#FEFDA3] group-hover:flex`}
            >
              Gather Points
            </p>
          </Link>

          <Link
            href={"/merchandise"}
            className="relative z-50 flex items-center"
          >
            <div className="flex aspect-square w-28 cursor-pointer items-center justify-center rounded-full bg-[url('/sidebar/bg-sidebar-item.svg')] bg-cover bg-no-repeat">
              <FaShoppingCart
                size={28}
                className={`mt-10 transition-all duration-100 ease-in-out group-hover:mt-12 ${pathname.startsWith("/merchandise") ? "text-pink-500" : "text-black"}`}
              />
            </div>
            <p
              className={`absolute ${pathname.startsWith("/merchandise") ? "font-semibold" : ""} left-32 ml-2 mt-12 hidden text-xl text-[#FEFDA3] group-hover:flex`}
            >
              Merchandise
            </p>
          </Link>
        </div>

        <div className="relative mt-24 flex w-full items-center">
          <div className="flex aspect-square w-28 cursor-pointer items-center justify-center rounded-full bg-[url('/sidebar/bg-sidebar-item.svg')] bg-cover bg-no-repeat">
            <BiLogOut
              size={26}
              className="mt-10 text-red-500 transition-all duration-100 ease-in-out group-hover:mt-12"
            />
          </div>
          <p className="absolute left-32 ml-2 mt-12 hidden text-xl text-[#FEFDA3] group-hover:flex">
            Log Out
          </p>
          <Image
            src={"/sidebar/seaweed-dashboard.svg"}
            width={150}
            height={32}
            alt="Icon Home"
            className="absolute bottom-4 right-0 hidden transition-all duration-100 ease-in-out group-hover:block"
          />
        </div>
      </div>
    </>
  );
}
