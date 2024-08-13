import { SidebarRoutes } from "@/app/(dashboard)/_components/sidebar-routes"
import React from "react"

export const SideBar = () => {
  return (
    <>
      <div className="flex-col hidden md:flex overflow-y-auto bg-white border-r border-muted-foreground/30 shadow-sm w-56">
        <div className="flex flex-col w-full">
          <SidebarRoutes />
        </div>
      </div>
    </>
  )
}
