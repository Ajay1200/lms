import type { Session, User } from "next-auth"
import type { JWT } from "@auth/core/jwt"
import { UserRole } from "@prisma/client"

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: UserRole
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      role?: UserRole
    }
  }

  interface User {
    role?: UserRole
  }
}
