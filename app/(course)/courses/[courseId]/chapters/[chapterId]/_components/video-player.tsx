"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Lock } from "lucide-react"

import { cn } from "@/lib/utils"
import { useConfettiStore } from "@/hooks/use-confetti-store"

import "@vidstack/react/player/styles/default/theme.css"
import "@vidstack/react/player/styles/default/layouts/video.css"

import { MediaPlayer, MediaProvider } from "@vidstack/react"
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default"
import { toast } from "sonner"
import axios from "axios"

interface VideoPlayerProps {
  courseId: string
  chapterId: string
  videoUrl: string
  nextChapterId: string
  isLocked: boolean
  completeOnEnd: boolean
  title: string
}

export const VideoPlayer = ({
  videoUrl,
  completeOnEnd,
  chapterId,
  courseId,
  isLocked,
  nextChapterId,
  title,
}: VideoPlayerProps) => {
  const router = useRouter()
  const confetti = useConfettiStore()

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        })

        if (!nextChapterId) {
          confetti.onOpen()
        }

        toast.success("Progress Updated")
        router.refresh()

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
        }
      }
    } catch {
      toast.error("Something went wrong")
    }
  }
  return (
    <div className="relative aspect-video overflow-hidden">
      {/* {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-500">
          <Loader2 className="h-10 w-10 animate-spin text-secondary" />
        </div>
      )} */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-500 flex-col gap-y-2 text-secondary">
          <Lock className="w-10 h-10" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MediaPlayer
          title={title}
          src={videoUrl}
          onEnded={onEnd}
          autoPlay
        >
          <MediaProvider />
          <DefaultVideoLayout icons={defaultLayoutIcons} />
        </MediaPlayer>
      )}
    </div>
  )
}
