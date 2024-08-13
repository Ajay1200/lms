import { auth } from "@/auth"

import { notFound } from "next/navigation"
import { DataTable } from "./_components/data-table"
import { columns } from "./_components/columns"
import { db } from "@/lib/db"

const CoursesPage = async () => {
  const session = await auth()
  const userId = session?.user?.id
  const isAdmin = session?.user?.role === "ADMIN"

  if (!isAdmin) {
    return notFound()
  }

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="pt-6 mx-12">
      <DataTable
        data={courses}
        columns={columns}
      />
    </div>
  )
}

export default CoursesPage
