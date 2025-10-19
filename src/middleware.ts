import { NextRequest } from "next/server";
import { auth } from "../auth";
import { authapiPrefix, authenticationRoutes, DEFAULT_REDIRECT_URL, publicRoutes } from "./lib/middlewereapiroute";


export async function middleware(req: NextRequest) {
    const session = (await auth())?.user?.email;

    const { nextUrl } = req;
    // next url is a whole long url object having href, pathname port etc
    // console.log(nextUrl);

    const isApiAuthRoutes = nextUrl.pathname.startsWith(authapiPrefix);

    // console.log(isApiAuthRoutes);
    // const isPublicRoutes = publicRoutes.includes(nextUrl.pathname)
    const isPublicRoutes = publicRoutes.some((route) => {
        if (route.endsWith("/*")) {
            // this is for submit thingy => like if the route ends with /asdadsa => then it slice it
            const baseUrl = route.slice(0, -2); // making /submit
            return nextUrl.pathname.startsWith(baseUrl + "/"); // then add / and checks the real routes
        }
        return nextUrl.pathname === route;
    });

    // console.log(isPublicRoutes, "public", nextUrl.pathname);

    const isAuthenticationRoutes = authenticationRoutes.includes(
        nextUrl.pathname
    );

    // console.log("auth", isAuthenticationRoutes);

    /**
     * user try to visit /api/auth for signin from anything
     * let them be in
     */
    if (isApiAuthRoutes) {
        return;
    }

    /**
     * if user goes to /signup or /login page let them be in
     * if already logged in them redirect to default_redirect_url
     */
    if (isAuthenticationRoutes) {
        if (session) {
            return Response.redirect(new URL(DEFAULT_REDIRECT_URL, nextUrl));
        }
        return;
    }

    if (session && isPublicRoutes) {
        return Response.redirect(new URL(DEFAULT_REDIRECT_URL, nextUrl));
    }

    if (!session && !isPublicRoutes) {
        return Response.redirect(new URL("/signin", nextUrl));
    }

    return;
}
export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
