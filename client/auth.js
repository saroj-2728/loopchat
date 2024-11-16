
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub({
            async profile(profile) {
                return { ...profile }
            },
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                name: { label: "Name", type: "text" },
                username: { label: "Username", type: "text" },
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
                    const profileImage = JSON.parse(credentials.profileImage || "{}");
                    
                    return { ...sanitizedCredentials, profileImage };
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account.provider === "github") {
                try {
                    const checkUserResponse = await fetch(`${process.env.SERVER_URL}/api/auth/check-user`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            username: `gi-${profile.login}`,
                        },
                    });

                    const userExists = await checkUserResponse.json();

                    if (!userExists.success) {

                        try {
                            const registerResponse = await fetch(`${process.env.SERVER_URL}/api/auth/register`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    name: profile.name || profile.login,
                                    username: `gi-${profile.login}`,
                                    email: profile.email,
                                    bio: profile.bio || "GitHub User",
                                    profileImage: {
                                        url: profile.avatar_url,
                                        public_id: null
                                    },
                                    oauthProvider: "github"
                                }),
                            });

                            const registerResult = await registerResponse.json();

                            if (!registerResult.success) {
                                console.error("Error registering GitHub user:", registerResult.message);
                                return false;
                            }
                        } catch (registerError) {
                            console.error("Error during registration:", registerError);
                            return false;
                        }
                    }
                } catch (checkUserError) {
                    console.error("Error checking user existence:", checkUserError);
                    return false;
                }

            }

            if (account.provider === "credentials") {

            }

            return true;
        },
        jwt({ token, user, account }) {

            if (user && account.provider === "github") {
                token.user = {
                    username: user.login,
                    name: user.name || user.login,
                    email: user.email,
                    bio: user.bio,
                    profileImage: { url: user.avatar_url },
                    oauthProvider: account.provider
                }
            }

            if (user && account.provider === "credentials") {
                token.user = {
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    bio: user.bio,
                    profileImage: user.profileImage,
                    oauthProvider: user.oauthProvider
                }
            }

            return token
        },
        session({ session, token }) {
            session.user = token.user;
            
            return session;
        },
    }
})