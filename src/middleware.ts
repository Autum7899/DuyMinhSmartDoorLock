// middleware.ts
// This file should be in the root of your project (next to the 'src' folder)

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    // The `withAuth` function augments your `Request` object with the user's token.
    function middleware(req) {
        console.log("Executing middleware for path: ", req.nextUrl.pathname);
        console.log("Token in middleware: ", req.nextauth.token);
        // You can add logic here to perform role-based access control if needed.
        // For example, check if `req.nextauth.token.role` is '(admin)'.
        // If the logic inside `authorized` callback passes, this function will be executed.

        // console.log("Token: ", req.nextauth.token);
        // console.log("Pathname: ", req.nextUrl.pathname);

        // If authorized, return the next response.
        return NextResponse.next();
    },
    {
        callbacks: {
            // This callback is invoked to decide if a user is authorized to access a page.
            // It's called before the `middleware` function above.
            authorized: ({ token }) => {
                console.log("Executing authorized callback. Token: ", token);
                // The `!!token` expression converts the token object (or null) into a boolean.
                // If a token exists, the user is considered authenticated.
                const isAuthorized = !!token;
                console.log("Is authorized: ", isAuthorized);
                return isAuthorized;
            },
        },
    }
);

// The config object specifies which paths the middleware will run on.
export const config = {
    /*
     * This matcher protects two sets of routes:
     * 1. The root (admin) page: /(admin)
     * 2. All pages inside the (admin) directory: /(admin)/...
     * This ensures that both /(admin) and /(admin)/example are secure.
     */
    matcher: ["/(admin)", "/(admin)/:path*"],
};
