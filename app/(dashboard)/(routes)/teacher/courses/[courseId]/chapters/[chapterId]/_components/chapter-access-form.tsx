"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Chapter } from "@prisma/client"
import { Checkbox } from "@/components/ui/checkbox"

interface ChapterAccessFormProps {
  initialData: Chapter
  courseId: string
  chapterId: string
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
})

export const ChapterAccessForm = ({ initialData, courseId, chapterId }: ChapterAccessFormProps) => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((current) => !current)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: !!initialData.isFree,
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
      toast("📚 Chapter updated", {
        description: "You've successfully updated the chapter",
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
      <div className="flex items-center justify-between">
        <p className="text-slate-600 font-[500]">Access Settings</p>
        <Button
          onClick={toggleEdit}
          variant="ghost"
          size="default"
        >
          {isEditing ? (
            <p className="text-slate-700">Cancel</p>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2 text-slate-700" />
              <p className="text-slate-600">Edit Access</p>
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        <div
          className={cn(
            "text-sm mt-2 text-slate-600",

            !initialData.isFree && "text-slate-500"
          )}
        >
          {initialData.isFree ? (
            <p className="text-slate-600 text-sm">This Chapter if free for preview</p>
          ) : (
            <p className="text-slate-600 text-sm">This chapter is not free</p>
          )}
        </div>
      ) : (
        <div className="mt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <div className="space-y-1 leading-none">
                      <FormDescription>
                        check this box if you want to make this chapter free for preview
                      </FormDescription>
                    </div>
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
    </div>
  )
}
