import { NextResponse } from "next/server"

import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const session = await auth()
    const userId = session?.user?.id || ""

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { isCompleted } = await req.json()

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId: params.chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId: params.chapterId,
        isCompleted,
      },
    })

    return NextResponse.json(userProgress)
  } catch (error: any) {
    console.log("CHAPTER_ID_PROGRESS", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
