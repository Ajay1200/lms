import { AlertTriangle, CheckCircle } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const bannerVariants = cva("border text-center w-full p-4 text-sm items-center", {
  variants: {
    variant: {
      warning: "bg-yellow-200/80 border-yellow-30 text-primary",
      success: "bg-emerald-600 border-emerald-800 text-secondary",
    },
  },
  defaultVariants: {
    variant: "warning",
  },
})

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string
}

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
}

export const Banner = ({ label, variant }: BannerProps) => {
  const Icon = iconMap[variant || "warning"]

  return (
    <div className={cn("flex items-center justify-start gap-x-1", bannerVariants({ variant }))}>
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </div>
  )
}
