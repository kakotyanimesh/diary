import { NextRequest } from "next/server";
import { auth } from "../auth";
import { authapiPrefix, authenticationRoutes, DEFAULT_REDIRECT_URL, publicRoutes } from "./lib/middlewereapiroute";


export async function middleware(req: NextRequest) {
    const session = (await auth())?.user?.email;

    const { nextUrl } = req;
  

    const isApiAuthRoutes = nextUrl.pathname.startsWith(authapiPrefix);

    const isPublicRoutes = publicRoutes.some((route) => {
        if (route.endsWith("/*")) {
          
            const baseUrl = route.slice(0, -2); 
            return nextUrl.pathname.startsWith(baseUrl + "/"); 
        }
        return nextUrl.pathname === route;
    });


    const isAuthenticationRoutes = authenticationRoutes.includes(
        nextUrl.pathname
    );


    if (isApiAuthRoutes) {
        return;
    }

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
