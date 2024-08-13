"use client"

import Image from "next/image"
import Link from "next/link"
import { IconBadge } from "./icon-badge"
import { BookOpen } from "lucide-react"
import { formatPrice } from "@/lib/format"
import { CourseProgress } from "./course-progress"

interface CourseCardProps {
  id: string
  title: string
  imageUrl: string
  chaptersLength: number
  price: number
  progress: number | null
  category: string
}

export const CourseCard = ({
  category,
  chaptersLength,
  id,
  imageUrl,
  price,
  progress,
  title,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video md:aspect-[16/12] rounded-md overflow-hidden">
          <Image
            className="object-cover"
            fill
            src={imageUrl}
            alt="courseimage"
          />
        </div>

        <div className="flex flex-col pt-2">
          <div className="text-base text-balance font-medium text-slate-600 hover:text-primary transition line-clamp-2">
            {title}
          </div>
          <p className="text-sm text-muted-foreground">{category}</p>

          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1">
              <IconBadge
                size="sm"
                icon={BookOpen}
              />
              <p className="text-slate-700">
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </p>
            </div>
          </div>

          {!progress ? (
            <p className="text-md md:text-sm font-medium text-slate-700">{formatPrice(price)}</p>
          ) : (
            <CourseProgress
              size="sm"
              value={progress}
              variant={progress === 100 ? "success" : "default"}
            />
          )}
        </div>
      </div>
    </Link>
  )
}
