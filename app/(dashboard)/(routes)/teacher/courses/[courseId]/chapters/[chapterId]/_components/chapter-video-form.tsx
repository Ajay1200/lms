"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import "@vidstack/react/player/styles/default/theme.css"
import "@vidstack/react/player/styles/default/layouts/video.css"

import { MediaPlayer, MediaProvider } from "@vidstack/react"
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default"

interface ChapterVideoFormProps {
  initialData: {
    videoUrl: string
  }
  courseId: string
  chapterId: string
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
})

export const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoFormProps) => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((current) => !current)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
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
        <p className="text-slate-600 font-[500]">Chapter video url</p>
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
              <p className="text-slate-600">Edit video url</p>
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        <div className="space-y-2">
          <p className="mt-2 font-semibold text-slate-600 text-lg">{initialData.videoUrl}</p>
          <MediaPlayer
            title="Sprite Fight"
            src={initialData.videoUrl}
          >
            <MediaProvider />
            <DefaultVideoLayout
              // thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
              icons={defaultLayoutIcons}
            />
          </MediaPlayer>
        </div>
      ) : (
        <div className="mt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="video url"
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
