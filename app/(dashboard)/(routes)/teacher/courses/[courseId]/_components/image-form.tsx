"use client"

import * as z from "zod"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { ImageIcon, Pencil, PlusCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Course } from "@prisma/client"
import Image from "next/image"
import { FileUpload } from "@/components/file-upload"

interface ImageFormProps {
  initialData: Course
  courseId: string
}

const formSchema = z.object({
  imageUrl: z.string().min(1, { message: "Image is required" }),
})

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((current) => !current)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values)
      toast("📚 Course updated", {
        description: "You've successfully updated the course",
      })
      toggleEdit()
      router.refresh()
    } catch (error: any) {
      toast(`⚠️ Something went wrong`, {
        description: error,
      })
    }
  }

  return (
    <div className="mt-6 border bg-secondary/50 rounded-md p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-600 font-[500]">Course Image</p>
        <Button
          onClick={toggleEdit}
          variant="ghost"
          size="default"
        >
          {isEditing && <p className="text-slate-700">Cancel</p>}

          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              <p className="text-slate-600">Add image</p>
            </>
          )}

          {!isEditing && initialData.imageUrl && (
            <div className="flex items-center">
              <Pencil className="h-4 w-4 mr-2 text-slate-700" />
              <p className="text-slate-600">Edit image</p>
            </div>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-600" />
          </div>
        ) : (
          <div className="relative aspect-[16/9]">
            <Image
              src={initialData.imageUrl}
              alt="upload"
              fill
              className="object-contain rounded-md"
            />
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url })
              }
            }}
          />

          <div className="text-xs text-muted-foreground mt-4">16:9 aspect ratio recommended</div>
        </div>
      )}
    </div>
  )
}
