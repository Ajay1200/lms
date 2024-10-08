import { NextResponse } from "next/server"

import { getServerSession } from "next-auth/next"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function POST(req: Request) {
  try {
    const session = await auth()

    const userId = session?.user?.id

    const { title } = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.log("[COURSES]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
