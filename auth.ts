import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signinObject } from "@/lib/config/user.config";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, auth, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "email password",
            credentials: {
                email: {
                    label: "email",
                    placeholder: "example@example.com",
                    type: "email",
                },
                password: {
                    label: "password",
                    placeholder: "your password here",
                    type: "password",
                },
            },
            authorize: async (credentials) => {
                if (!credentials.password && !credentials.email) {
                    return null;
                }
                try {
                    const parseddata = signinObject.safeParse(credentials);
                    if (!parseddata.success) {
                        return null;
                    }

                    const existingUser = await prisma.user.findUnique({
                        where: {
                            email: parseddata.data.email,
                        },
                        omit: { password: false },
                    });

                    if (!existingUser) return null;

                    const comparePassword = await bcrypt.compare(
                        parseddata.data.password,
                        existingUser.password as string
                    );

                    if (!comparePassword) return null;

                    return {
                        id: String(existingUser.id),
                        email: existingUser.email,
                    } as const;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ user, token }) {
            if (user) {
                token.email = user.email;
                token.sub = user.id;
            }
            return token;
        },
        async session({ token, session }) {
            if (token.sub) {
                session.user.email = token.email as string;
                session.user.id = token.sub;
            }
            return session;
        },
    },
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/signin",
    },
});
