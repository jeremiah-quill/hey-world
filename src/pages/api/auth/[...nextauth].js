import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      // the following is needed to force the user to select an account on sign in (otherwise it will just use the last used account,
      // and I don't love that UX unless it's opt-in)
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  // theme: {
  //   colorScheme: "light",
  // },
  // callbacks: {
  //   // no idea what this does from the boilerplate:
  //   // async jwt({ token }) {
  //   //   token.userRole = "admin";
  //   //   return token;
  //   // },
  //   async session({ session, token, user }) {
  //     // Send properties to the client, like an access_token and user id from a provider.
  //     session.user.id = user.id;
  //     return session;
  //   },
  // },
};
export default NextAuth(authOptions);
