import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
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
