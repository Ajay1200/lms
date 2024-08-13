import React from "react"
import { Categories } from "./_components/categories"
import { db } from "@/lib/db"
import { SearchInput } from "@/components/search-input"
import { getCourses } from "@/actions/get-courses"
import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { CoursesList } from "@/components/courses-list"

interface SearchPageProps {
  searchParams: {
    title: string
    categoryId: string
  }
}

const Search = async ({ searchParams }: SearchPageProps) => {
  const session = await auth()
  const userId = session?.user?.id

  // if (!session) {
  //   return notFound()
  // }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  })

  const courses = await getCourses({
    userId,
    ...searchParams,
  })

  return (
    <>
      <div className="px-6 pt-6 sm:block md:hidden md:mb-0">
        <SearchInput />
      </div>
      <div className="p-6">
        <Categories items={categories} />

        <CoursesList items={courses} />
      </div>
    </>
  )
}

export default Search
