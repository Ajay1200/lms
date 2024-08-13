"use client"

import { ConfirmModal } from "@/components/confirm-modal"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import { useRouter } from "next/navigation"

interface ChapterActionsProps {
  disabled: boolean
  courseId: string
  chapterId: string
  isPublished: boolean
}

export const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onClick = async () => {
    try {
      setIsLoading(true)

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
        toast("📚 Chapter Unpublished", {
          description: "Chapter has been unpublished",
        })
      } else {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
        toast("📚 Chapter Published", {
          description: "Chapter has been published",
        })
      }

      router.refresh()
    } catch (error: any) {
      toast(`⚠️ Something went wrong`, {
        description: error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true)

      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
      toast("📚 Chapter Deleted", {
        description: "Chapter has been deleted",
      })
      router.refresh()
      router.push(`/teacher/courses/${courseId}`)
    } catch (error: any) {
      toast(`⚠️ Something went wrong`, {
        description: error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        disabled={disabled || isLoading}
        variant="outline"
        size="default"
        onClick={onClick}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <Trash2 className="h-4 w-4 text-center text-destructive" />
        </Button>
      </ConfirmModal>
    </div>
  )
}
