import React from "react"
import { Progress } from "./ui/progress"
import { cn } from "@/lib/utils"

interface CourseProgressProps {
  value: number | null
  variant?: "default" | "success"
  size?: "default" | "sm"
}

export const CourseProgress = ({ value, size, variant }: CourseProgressProps) => {
  const COLOR_BY_VARIANT = {
    default: "text-slate-700",
    success: "text-primary",
  }

  const SIZE_BY_VARIANT = {
    default: "text-sm",
    sm: "text-xs",
  }

  return (
    <div>
      <Progress className="h-4" value={value} variant={"success"} />
      <p
        className={cn(
          "text-slate-500 font-medium mt-2",
          COLOR_BY_VARIANT[variant || "default"],
          SIZE_BY_VARIANT[size || "default"]
        )}
      >
        {Math.round(value!)}% complete
      </p>
    </div>
  )
}
