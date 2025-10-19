"use client";
import { cn } from "@/lib/cn";
import { forwardRef, HTMLAttributes } from "react";
import { Logo } from "./ui/logo";

export const Navbar = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            className={cn(className, "justify-center items-center flex")}
            {...props}
            ref={ref}>
            <Logo className="fixed mt-20" />
        </div>
    );
});

Navbar.displayName = "Navbar";
