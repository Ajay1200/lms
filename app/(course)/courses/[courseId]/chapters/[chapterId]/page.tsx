import { getChapter } from "@/actions/get-chapter"
import { auth } from "@/auth"
import { Banner } from "@/components/banner"
import { redirect } from "next/navigation"
import React from "react"
import { VideoPlayer } from "./_components/video-player"
import { CourseEnrollButton } from "./_components/course-enroll-button"
import { Separator } from "@/components/ui/separator"
import { Preview } from "@/components/preview"
import { File } from "lucide-react"
import CourseProgressButton from "./_components/course-progress-button"

const ChapterId = async ({ params }: { params: { courseId: string; chapterId: string } }) => {
  const session = await auth()
  const userId = session?.user?.id || ""

  if (!session) {
    return redirect("/")
  }

  const { chapter, course, attachments, nextChapter, userProgress, purchase } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  })

  if (!chapter || !course) {
    return redirect("/")
  }

  const isLocked = !chapter?.isFree && !purchase
  const completeOnEnd = !!purchase && !userProgress?.isCompleted

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="You've already completed this chapter"
        />
      )}
      {isLocked && (
        <Banner
          label="You need to purchase this course to watch this chapter"
          variant="warning"
        />
      )}

      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            videoUrl={chapter.videoUrl || ""}
            chapterId={chapter.id}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>

        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price}
              />
            )}
          </div>

          <Separator />

          <div>
            <Preview value={chapter.description!} />
          </div>

          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.Url}
                    key={attachment.id}
                    target="_blank"
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <p className="line-clamp-1">
                      <File className="w-5 h-5" />
                      {attachment.name}
                    </p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChapterId
