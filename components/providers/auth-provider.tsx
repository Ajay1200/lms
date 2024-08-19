"use client"

import { SessionProvider } from "next-auth/react"

async function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

export default AuthProvider
