"use client"

import { SignInDialog } from "@/components/sign-in-dialog"
import UserDropdown from "@/components/user-dropdown"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

import { Session } from "next-auth"
import { Chapter, Course, UserProgress } from "@prisma/client"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { CourseSidebar } from "./course-sidebar"
import { redirect } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"

interface CourseNavbarProps {
  session: Session | null
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null
    })[]
  }
  progressCount: number
}

const NavbarRoutes = ({ course, progressCount, session }: CourseNavbarProps) => {
  return (
    <div
      className={cn(
        "fixed top-0 w-full flex justify-center border-b border-muted-foreground/30 z-30 bg-slate-50 transition-all"
        // scrolled && "border-b border-slate-200 bg-slate-50/80 backdrop-blur-xl"
      )}
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
        </Link>

        <div className="flex items-center justify-center gap-x-2">
          {session ? <UserDropdown session={session} /> : <SignInDialog />}

          <Link
            href="/"
            className={buttonVariants({
              variant: "secondary",
              className: "hidden md:block",
            })}
          >
            <span>Exit</span>
          </Link>

          <Sheet>
            <SheetTrigger className="sm:block md:hidden hover:opacity-75 transition">
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent>
              <CourseSidebar
                course={course}
                progressCount={progressCount}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}

export default NavbarRoutes
