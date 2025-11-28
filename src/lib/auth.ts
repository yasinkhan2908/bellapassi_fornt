import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                mobile: { label: 'Mobile', type: 'text' },
                otp: { label: 'OTP', type: 'text' },
            },
            async authorize(credentials) {
                try {
                  
                    if (!credentials?.mobile || !credentials?.otp) {
                        throw new Error('Mobile and OTP are required');
                    }
                    const payload = JSON.stringify({
                                      mobile: credentials.mobile,
                                      otp: credentials.otp,
                                    });

                    console.log("➡️ Payload before sending:", payload);
                    console.log(credentials.mobile);
                    console.log(credentials.otp);
                    console.log("url",`${process.env.API_URL}/api/user/otp-verification`);
                    // Call your OTP verification API
                    const response = await fetch(`${process.env.API_URL}/api/user/otp-verification`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: payload,
                    });

                    const data = await response.json();
                    console.log("return data",data.success);
                    if (data.success==true) {
                        return {
                            id: data.id.toString(),
                            name: data.name,
                            email: data.email,
                            mobile: data.mobile,
                            token: data.access_token,
                        };
                    } else {
                        throw new Error(data.message || 'OTP verification failed');
                    }
                } catch (error) {
                    console.error('Authorization error:', error);
                    throw new Error('Authentication failed');
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }: { token: any; user: any }) {
            if (user) {
                token.user = user;
                token.accessToken = user.token;
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            session.user = token.user;
            session.accessToken = token.accessToken;
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '',
    },
    session: {
        strategy: 'jwt' as const,
        maxAge: 24 * 60 * 60, // 24 hours
    },
};

