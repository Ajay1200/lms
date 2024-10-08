import { db } from "@/lib/db"
import { Chapter, Course, UserProgress } from "@prisma/client"
import { CourseSidebarItem } from "./course-sdebar-item"
import { CourseProgress } from "@/components/course-progress"
import { auth } from "@/auth"

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null
    })[]
  }
  progressCount: number
}

export const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {
  const session = await auth()
  const userId = session?.user?.id || ""
  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  })

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col text-center border-b">
        <h1 className="font-bold text-slate-700">{course.title}</h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress
              variant="success"
              value={progressCount}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  )
}
