"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Course } from "@prisma/client"

interface DescriptionFormProps {
  initialData: Course
  courseId: string
}

const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
})

export const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((current) => !current)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  })

  const { isSubmitting, isValid } = form.formState

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
      <div className="flex items-center justify-between">
        <p className="text-slate-600 font-[500]">Description</p>
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
              <p className="text-slate-600">Edit description</p>
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        <p
          className={cn(
            "text-sm mt-2 text-slate-600",

            !initialData.description && "text-slate-500"
          )}
        >
          {initialData.description || "No Description"}
        </p>
      ) : (
        <div className="mt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        disabled={isSubmitting}
                        placeholder="description"
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
    </div>
  )
}
