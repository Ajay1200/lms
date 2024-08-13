"use client"

import { ConfirmModal } from "@/components/confirm-modal"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useConfettiStore } from "@/hooks/use-confetti-store"

interface ActionsProps {
  disabled: boolean
  courseId: string
  isPublished: boolean
}

export const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const confetti = useConfettiStore()
  const router = useRouter()

  const onClick = async () => {
    try {
      setIsLoading(true)

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`)
        toast("📚 Course Unpublished", {
          description: "Course has been unpublished",
        })
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`)
        toast("📚 Course Published", {
          description: "Course has been published",
        })
        confetti.onOpen()
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

      await axios.delete(`/api/courses/${courseId}`)
      toast("📚 Course Deleted", {
        description: "Course has been deleted",
      })
      router.refresh()
      router.push(`/teacher/courses`)
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
