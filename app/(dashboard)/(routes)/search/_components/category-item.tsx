"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { IconType } from "react-icons"
import qs from "query-string"

interface CategoryItemProps {
  label: string
  value?: string
  icon?: IconType
}

export const CategoryItem = ({ label, icon: Icon, value }: CategoryItemProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategoryId = searchParams.get("categoryId")
  const currentTitle = searchParams.get("title")

  const isSelected = currentCategoryId == value

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    )

    router.push(url)
  }

  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className={cn(
        "py-2 px-3 text-xs gap-x-1 text-slate-800",
        isSelected && "border-primary bg-secondary"
        //change style if actibe
      )}
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">{label}</div>
    </Button>
  )
}
