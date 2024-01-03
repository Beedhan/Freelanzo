import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ token }) {
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/invoice/:path*",
    "/dashboard/:path*",
    "/projects/:path*",
    "/inbox/:path*",
    "/services/:path*",
    "/workspace/:path*",
    "/checkout/:path*",
    "/quotes/:path*",
  ],
};
