import _NextAuth from "next-auth";
import _Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const NextAuth = _NextAuth.default ?? _NextAuth;
const CredentialsProvider = _Credentials.default ?? _Credentials;

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;
        
        if (!user.isApproved) {
          throw new Error("ACCOUNT_PENDING")
        }
        
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          points: user.points,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // On login: store user data in token
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.email = token.email;

      // Always fetch fresh name from DB to prevent stale JWT data
      if (token.id) {
        try {
          const freshUser = await prisma.user.findUnique({
            where: { id: token.id },
            select: { name: true, email: true, role: true },
          });
          if (freshUser) {
            session.user.name = freshUser.name;
            session.user.email = freshUser.email;
            session.user.role = freshUser.role;
          }
        } catch {
          // Non-critical — fall back to token data
        }
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
