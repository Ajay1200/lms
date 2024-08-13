import { NextResponse } from "next/server"

import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const session = await auth()

    const userId = session?.user?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
      include: {
        chapters: {
          select: {
            isPublished: true,
          },
        },
      },
    })

    if (!course) {
      return new NextResponse("Not Found", { status: 404 })
    }

    const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished)

    if (
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !hasPublishedChapter ||
      !course.categoryId
    ) {
      return new NextResponse("MIssing required fields", { status: 401 })
    }

    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    })

    return NextResponse.json(publishedCourse)
  } catch (error: any) {
    console.log("COURSE_ID_PUBLISH", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
