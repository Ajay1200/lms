import { NextResponse } from "next/server"

import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
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
      // include: {
      //   chapters: {
      //     include: {
      //       muxData: true,
      //     },
      //   },
      // },
    })

    if (!course) {
      return new NextResponse("Not Found", { status: 404 })
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    })

    return NextResponse.json(deletedCourse)
  } catch (error: any) {
    console.log("COURSE_ID_DELETE", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const session = await auth()

    const userId = session?.user?.id
    const { courseId } = params
    const values = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    })

    return NextResponse.json(course)
  } catch (error: any) {
    console.log("[COURSE_ID]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
