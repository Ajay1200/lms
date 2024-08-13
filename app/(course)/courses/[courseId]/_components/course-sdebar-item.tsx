"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckCircle, Lock, PlayCircle } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import React from "react"

interface CourseSidebarItemProps {
  label: string
  id: string
  isCompleted: boolean
  courseId: string
  isLocked: boolean
}

export const CourseSidebarItem = ({
  courseId,
  id,
  isCompleted,
  isLocked,
  label,
}: CourseSidebarItemProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle
  const isActive = pathname?.includes(id)

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`)
  }

  return (
    <Button
      onClick={onClick}
      size="default"
      variant="ghost"
      type="button"
      className={cn(
        "text-slate-600 py-6",
        isActive && "bg-slate-200",
        isCompleted && "text-primary hover:text-primary"
      )}
    >
      <div className="flex flex-row items-center justify-between gap-2 py-4">
        <Icon
          className={cn(isCompleted && "text-primary font-semibold")}
          size={22}
        />
        {label}
      </div>

      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
          isActive && "opacity-100",
          isCompleted && "border-primary"
        )}
      />
    </Button>
  )
}
