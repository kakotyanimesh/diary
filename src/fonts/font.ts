import { Geist, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import localFont from "next/font/local";

export const geist = Geist({
    subsets : ["latin"],
    variable : "--geistfont"
})



export const dottedFont = localFont({
    src: "./Array-Regular.otf",
    display: "swap",
    variable: "--dotted-font",
});

export const paperCandy = localFont({
    src: "./Paper-Candy.otf",
    display : "swap",
    variable : "--paper-candy"
});


export const plexMono = IBM_Plex_Mono({
    variable: "--font-plexMono",
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
});

export const plexSans = IBM_Plex_Sans({
    variable: "--font-plexSans",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});