"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { File, ImageIcon, Loader2, Pencil, PlusCircle, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Attachment, Course } from "@prisma/client"
import Image from "next/image"
import { FileUpload } from "@/components/file-upload"

interface AttachmentsFormProps {
  initialData: Course & { attachments: Attachment[] }
  courseId: string
}

const formSchema = z.object({
  url: z.string().min(1),
})

export const AttachmentsForm = ({ initialData, courseId }: AttachmentsFormProps) => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const toggleEdit = () => setIsEditing((current) => !current)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values)
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

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
      toast("Attachment Deleted", {
        description: "Successfully deleted the attachments",
      })
      router.refresh()
    } catch (error: any) {
      toast(`⚠️ Something went wrong`, {
        description: error,
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mt-6 border bg-secondary/50 rounded-md p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-600 font-[500]">Course Attachemnts</p>
        <Button
          onClick={toggleEdit}
          variant="ghost"
          size="default"
        >
          {isEditing && <p className="text-slate-700">Cancel</p>}

          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              <p className="text-slate-600">Add files</p>
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="mt-2 text-slate-600 text-sm">No attachments</p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 w-full bg-slate-200/35 border-slate-200 border text-primary rounded-md"
                >
                  <div className="flex items-center">
                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                    <p className="text-sm line-clamp-1">{attachment.name}</p>
                  </div>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <Button
                      onClick={() => onDelete(attachment.id)}
                      variant="ghost"
                      size="icon"
                    >
                      <Trash2 className="h-4 w-4 text-slate-600 hover:text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url })
              }
            }}
          />

          <div className="text-xs text-muted-foreground mt-4">
            add notes or resources that students might need to complete the course
          </div>
        </div>
      )}
    </div>
  )
}
