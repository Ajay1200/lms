import { getAnalytics } from "@/actions/get-analytics"
import { auth } from "@/auth"
import { notFound } from "next/navigation"
import { DataCard } from "./_components/data-card"
import { Chart } from "./_components/chart"

const AnalyticsPage = async () => {
  const session = await auth()
  const userId = session?.user?.id || ""
  const isAdmin = session?.user?.role === "ADMIN"

  if (!isAdmin) {
    return notFound()
  }

  const { data, totalRevenue, totalSales } = await getAnalytics(userId)

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard
          label="Total Sales"
          value={totalSales}
        />
        <DataCard
          label="Total Revenue"
          value={totalRevenue}
        />
      </div>

      <Chart data={data} />
    </div>
  )
}

export default AnalyticsPage
