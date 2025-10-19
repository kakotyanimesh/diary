import { cn } from "@/lib/cn";
import Link from "next/link";
import React, { forwardRef, HTMLAttributes,  } from "react";

export const Logo = forwardRef<HTMLAnchorElement, HTMLAttributes<HTMLAnchorElement>>(
    ({ className, ...props }, ref) => {
        return (
            <Link
                href={"/"}
                className={cn("text-2xl font-dotted bg-purple px-4 py-1 rounded-2xl shadow-purple backdrop-blur-2xl z-10 text-center w-fit", className,)}
                {...props}
                ref={ref}>
                 JURNO
            </Link>
        );
    }
);

Logo.displayName = "h1";