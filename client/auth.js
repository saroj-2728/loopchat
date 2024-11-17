
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from 'next-auth/providers/google'
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"
import { v4 as uuidv4 } from 'uuid';

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            allowDangerousEmailAccountLinking: true
        }),
        GitHub,
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Username", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (credentials) {
                    const sanitizedCredentials = Object.fromEntries(
                        Object.entries(credentials).map(([key, value]) => [
                            key,
                            value === "null" ? null : value,
                        ])
                    );

                    return { ...sanitizedCredentials };
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (profile && account) {
                user.provider = account.provider;
                user.bio = profile?.bio || null;
                user.username = (profile.login || "") + "_" + uuidv4();
            }
            return true;
        },
        jwt({ token, user, account }) {
            if (user && account.provider !== "credentials" ) {
                const { password, ...userWithoutPassword } = user;
                token.user = userWithoutPassword;
            }
            // if (user && account.provider === "credentials" ) {
            //     console.log(user, token);
            //     const { password, ...userWithoutPassword } = user;
            //     token.user = userWithoutPassword;
            // }
            return token
        },

        async session({ session, token }) {
            session.user = token.user;
            
            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
})

