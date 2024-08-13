"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"

import * as z from "zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is Required" }),
})

const CreateCoursePage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  const { isSubmitting, isValid } = form.formState
  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values)
      router.push(`/teacher/courses/${response.data.id}`)
      toast("📚 Course Created", {
        description: "You've successfully created the course",
      })
    } catch (error: any) {
      toast(`⚠️ Something went wrong`, {
        description: error,
      })
    }
  }

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div className="">
        <h1 className="text-2xl text-primary">Name of your course</h1>
        <p className="text-sm text-slate-500">
          What would you like to name your course ? Don&apos;nt worry you can change it whenever you
          want
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>

                  <FormControl>
                    <Input disabled={isSubmitting} placeholder="e.g 'AI development'" {...field} />
                  </FormControl>

                  <FormDescription>What will you teach in this course ?</FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-3">
              <Link href="/">
                <Button variant="secondary" size="default">
                  Cancel
                </Button>
              </Link>

              <Button
                variant="default"
                size="default"
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreateCoursePage
