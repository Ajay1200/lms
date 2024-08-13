"use client"

import useScroll from "@/hooks/useScroll"
import { Session } from "next-auth"
import Image from "next/image"
import Link from "next/link"

import UserDropdown from "./user-dropdown"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Menu } from "lucide-react"
import { SidebarRoutes } from "@/app/(dashboard)/_components/sidebar-routes"
import { TeacherMode } from "./teacher-mode"
import { SignInDialog } from "./sign-in-dialog"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { SearchInput } from "./search-input"
import { Button } from "./ui/button"

export default function Navbar({ session }: { session: Session | null }) {
  const scrolled = useScroll(10)
  const pathname = usePathname()
  const isSearchPage = pathname === "/search"
  const isPlayerPage = pathname?.includes("/courses")

  const router = useRouter()
  return (
    <>
      <div
        className={cn(
          "fixed top-0 w-full flex justify-center border-b border-muted-foreground/30 z-30 transition-all",
          scrolled && "border-b border-slate-200 bg-slate-50/80 backdrop-blur-xl"
        )}
        //       className={`fixed top-0 w-full flex justify-center border-b border-muted-foreground/30
        // ${scrolled ?? "border-b border-gray-200 bg-white/70 backdrop-blur-xl"} z-30 transition-all
        // `}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between w-full">
          <Link
            href="/"
            className="flex items-center gap-x-2 font-display text-2xl"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={36}
              height={36}
            />
            {/* <p>LMS Portal</p> */}
          </Link>
          <div className="max-w-xl">
            {isSearchPage && (
              <div className="hidden md:block">
                <SearchInput />
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-x-2">
            {session ? <UserDropdown session={session} /> : <SignInDialog />}

            {!isPlayerPage ? (
              <div className="hidden md:block">
                <TeacherMode />
              </div>
            ) : (
              <div className="hidden md:block">
                <Button
                  onClick={() => router.back()}
                  variant="ghost"
                  size="default"
                  className="px-6"
                >
                  Exit
                </Button>
              </div>
            )}

            <Sheet>
              <SheetTrigger>
                <Menu className="h-5 w-5 ml-[-5px] mr-[5px] md:hidden" />
              </SheetTrigger>
              <SheetContent>
                <div className="mt-8">
                  <SidebarRoutes />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </>
  )
}
