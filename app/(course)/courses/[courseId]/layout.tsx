import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { getProgress } from "@/actions/get-progress"
import { CourseSidebar } from "./_components/course-sidebar"
import { CourseNavbar } from "./_components/course-navbar"
import { auth } from "@/auth"

const courseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { courseId: string }
}) => {
  const session = await auth()
  const userId = session?.user?.id || ""

  if (!session) {
    return redirect("/")
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  })

  if (!course) {
    return redirect("/")
  }

  const progressCount = await getProgress(userId, course.id)

  return (
    <div className="min-h-screen w-full">
      <CourseNavbar
        course={course}
        progressCount={progressCount}
      />
      {/* <div className="h-[9vh] md:pl-80 fixed inset-y-0 w-full z-50">
      </div> */}
      <div className="hidden pt-[60px] md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar
          course={course}
          progressCount={progressCount}
        />
      </div>
      <main className="md:pl-80 h-full pt-[65px]">{children}</main>
    </div>
  )
}

export default courseLayout
