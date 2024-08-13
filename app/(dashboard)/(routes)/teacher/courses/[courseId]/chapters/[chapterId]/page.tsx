import { auth } from "@/auth"
import { IconBadge } from "@/components/icon-badge"
import { db } from "@/lib/db"
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import React from "react"
import { ChapterTitleForm } from "./_components/chapter-title-form"
import { ChapterDescriptionForm } from "./_components/chapter-description-form"
import { ChapterAccessForm } from "./_components/chapter-access-form"
import { ChapterVideoForm } from "./_components/chapter-video-form"
import { Banner } from "@/components/banner"
import { ChapterActions } from "./_components/chapter-actions"

const ChapterIdPage = async ({ params }: { params: { courseId: string; chapterId: string } }) => {
  const session = await auth()
  const isAdmin = session?.user?.role === "ADMIN"

  if (!isAdmin) {
    return notFound()
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    // include: {
    //   videoUrl: true,
    // },
  })

  if (!chapter) {
    return redirect("/")
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length

  const completionText = `(${completedFields}/${totalFields})`

  const isComplete = requiredFields.every(Boolean)

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is unpublished hence not visible in the course page"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              className="flex items-center text-sm hover:opacity-85 transition mb-6"
              href={`/teacher/courses/${params.courseId}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <p className="text-slate-600">Back to Course Setup</p>
            </Link>

            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium text-primary">Chapter Creation</h1>
                <p className="text-[13px] mt-[-6px] text-slate-600">
                  Complete all fields ${completionText}
                </p>
              </div>

              <ChapterActions
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl text-slate-700 font-medium">Customize your Chapter</h2>
              </div>

              {/* Chapter Title Form */}
              <ChapterTitleForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />

              <ChapterDescriptionForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl text-slate-700 font-medium">Access Settings</h2>
              </div>

              <ChapterAccessForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl text-slate-700 font-medium">Add a chapter video</h2>
            </div>

            <ChapterVideoForm
              initialData={{ videoUrl: chapter.videoUrl || "" }}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ChapterIdPage
