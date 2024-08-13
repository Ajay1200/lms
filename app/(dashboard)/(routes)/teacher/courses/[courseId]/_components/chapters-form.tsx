"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Loader2, PlusCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Chapter, Course } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { ChaptersList } from "./chapters-list"

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] }
  courseId: string
}

const formSchema = z.object({
  title: z.string().min(1),
})

export const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const toggleCreating = () => {
    setIsCreating((current) => !current)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values)
      toast("📚 Chapter updated", {
        description: "You've successfully updated the chapter",
      })
      toggleCreating()
      form.reset()
      router.refresh()
    } catch (error: any) {
      toast(`⚠️ Something went wrong`, {
        description: error,
      })
    }
  }

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true)

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData,
      })
      toast("📚 Chapters reordered", {
        description: "You've successfully reordered the chapter",
      })
      router.refresh()
    } catch (error: any) {
      toast(`⚠️ Something went wrong`, {
        description: error,
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`)
  }

  return (
    <div className="relative mt-6 border bg-secondary/50 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 p-4 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-emerald-500" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="text-slate-600 font-[500]">Chapters</p>
        <Button
          onClick={toggleCreating}
          variant="ghost"
          size="default"
        >
          {isCreating ? (
            <p className="text-slate-700">Cancel</p>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2 text-slate-700" />
              <p className="text-slate-600">Add Chapter</p>
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <div className="mt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Introduction to the course"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-x-2 mt-4">
                <Button
                  disabled={!isValid || isSubmitting}
                  variant="default"
                  size="default"
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-[13px] text-slate-500 mt-3",
            !initialData.chapters.length && "text-slate-500"
          )}
        >
          {!initialData.chapters.length && "No Chapters"}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}

      {!isCreating && (
        <p className="text-[13px] mt-1.5 text-slate-500 capitalize font-medium">
          Drag & Drop to reorder the Chapters
        </p>
      )}
    </div>
  )
}
