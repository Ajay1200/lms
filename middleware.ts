import { withAuth } from "next-auth/middleware"

export const config = {
  matcher: ["/api/:path*", "/teacher/:path*", "/search"],
}

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      return Boolean(token)
    },
  },
})
