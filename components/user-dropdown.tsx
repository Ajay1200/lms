"use client"

import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import Image from "next/image"
import { Separator } from "./ui/separator"
import { LayoutDashboard, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function UserDropdown({ session }: { session: Session }) {
  const router = useRouter()
  return (
    <div className="flex items-center justify-center text-left">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            <Image
              src={session?.user?.image || ""}
              width={38}
              height={38}
              alt="profile"
              className="rounded-full"
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="md:w-80">
          <div className="flex flex-col items-center my-1 w-full">
            <h3 className="text-sm font-semibold">{session?.user?.email}</h3>
            <p className="text-[13.5px]">{session?.user?.name}</p>
          </div>

          <Separator />
          <div className="flex mt-4">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="ghost"
              className="flex items-start justify-start gap-x-2 w-full"
            >
              <LayoutDashboard className="w-5 h-5" />
              <p className="text-[14px]">Dashboard</p>
            </Button>
            {/* <Link
              href="/dashboard"
              className="flex items-center gap-x-2"
            >
              <LayoutDashboard className="w-5 h-5" />
              <p className="text-[14px]">Dashboard</p>
            </Link> */}
          </div>

          <div className="flex my-3">
            <Button
              onClick={() => signOut()}
              variant="ghost"
              className="flex items-start justify-start gap-x-2 w-full"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              <p className="text-[14px] text-red-500">Logout</p>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
