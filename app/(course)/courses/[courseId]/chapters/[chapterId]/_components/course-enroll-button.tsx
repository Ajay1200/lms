"use client"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"
import axios from "axios"
import { useState } from "react"
import { toast } from "sonner"

interface CourseEnrollButtonProps {
  price: number | null
  courseId: string
}

export const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onClick = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(`/api/courses/${courseId}/checkout`)

      window.location.assign(response.data.url)
    } catch (error: any) {
      toast(`⚠️ Something went wrong`, {
        description: error,
      })
      setIsLoading(false)
    }
  }
  return (
    <Button
      disabled={isLoading}
      onClick={onClick}
      variant="default"
      size="lg"
    >
      Enroll for {formatPrice(price!)}
    </Button>
  )
}
