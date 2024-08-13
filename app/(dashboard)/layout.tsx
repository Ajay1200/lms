import Nav from "@/components/nav"
import "@uploadthing/react/styles.css"
import { SideBar } from "@/components/side-bar"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Nav />
      <div className="flex w-full min-h-screen pt-[65px]">
        <SideBar />
        {/* <main className="md:pl-56 pt-[80px] h-full">{children}</main> */}

        <main className="w-full">{children}</main>
      </div>
    </>
  )
}

export default DashboardLayout
