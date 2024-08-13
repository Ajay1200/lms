import { getDashboardCourses } from "@/actions/get-dashboard-courses"
import { auth } from "@/auth"
import { CoursesList } from "@/components/courses-list"
import { CheckCircle, Clock } from "lucide-react"
import { notFound, redirect } from "next/navigation"
import InfoCard from "./_components/info-card"

const DashboardPage = async () => {
  const session = await auth()
  const userId = session?.user?.id || ""

  // if (!session) {
  //   return notFound()
  // }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId)
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="InProgress"
          numberOfItems={coursesInProgress.length}
        />

        <InfoCard
          icon={CheckCircle}
          label="InProgress"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>

      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  )
}

export default DashboardPage
