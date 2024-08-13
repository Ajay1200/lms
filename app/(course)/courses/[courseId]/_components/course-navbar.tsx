import { Chapter, Course, UserProgress } from "@prisma/client"
import NavbarRoutes from "./navbar-routes"
import { auth } from "@/auth"

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null
    })[]
  }
  progressCount: number
}

export const CourseNavbar = async ({ course, progressCount }: CourseNavbarProps) => {
  const session = await auth()
  return (
    <div className="flex h-full items-center bg-white shadow-sm">
      <NavbarRoutes
        session={session}
        course={course}
        progressCount={progressCount}
      />
      {/* <CourseMobileSidebar
        course={course}
        progressCount={progressCount}
      /> */}
    </div>
  )
  // return <div className="p-4 border-b h-full items-center bg-red-400 shadow-sm"></div>
}
