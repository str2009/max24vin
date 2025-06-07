import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "guest",
      name: "Guest",
      credentials: {
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        // Здесь можно добавить любую логику — сейчас просто возвращает пользователя по имени
        if (credentials?.name) {
          return {
            id: credentials.name,
            name: credentials.name,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
