"use client"

import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
import Link from "next/link"

export const TeacherMode = () => {
  const pathname = usePathname()

  const isTeacherPage = pathname?.startsWith("/teacher")
  const isPlayerPage = pathname?.startsWith("/chapter")

  return (
    <>
      <div>
        {isTeacherPage || isPlayerPage ? (
          <Link href="/">
            <Button variant="outline" size="default">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/teacher/courses">
            <Button variant="outline" size="sm">
              Teacher mode
            </Button>
          </Link>
        )}
      </div>
    </>
  )
}
