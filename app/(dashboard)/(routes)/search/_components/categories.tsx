"use client"

import { Category } from "@prisma/client"
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc"
import { IconType } from "react-icons"
import { CategoryItem } from "./category-item"

interface CategoriesProps {
  items: Category[]
}

const iconsMap: Record<Category["name"], IconType> = {
  Music: FcMusic,
  "Computer Science": FcMultipleDevices,
  Fitness: FcSportsMode,
  Photography: FcOldTimeCamera,
  Accounting: FcSalesPerformance,
  Engineering: FcEngineering,
  Filming: FcFilmReel,
}

export const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 md:gap-x-4 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconsMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  )
}
