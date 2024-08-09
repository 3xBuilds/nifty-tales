import User from "@/schemas/userSchema";
import { connectToDB } from "@/utils/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {

    async signIn( {user, account} : {user:any, account:any} ) {

      await connectToDB();
      if (account.provider === "google") {
         const {name, email} = user;
         const userNameExists = await User.findOne({
          email
         });
         if(userNameExists){
          //  console.log('----user exists in db: ', userNameExists);
           return true;
         }
         else{
            // console.log('----creating user in db');
            await User.create({
              email,
              username: name,
            });
            return true;
         }
      }
      return true;
    },
    async jwt({ token, user, account }) {

      const dbUser = await User.findOne({
        email: token.email
      });

      if(!dbUser){
        // console.log('----user not found in db');
        return token;
      }

      // Add user id and provider to the token
      if (account?.provider && user) {
        token.provider = account.provider;
        token.id = user.id;

        // Generate your own access token and refresh token
        const accessToken = jwt.sign(
          { userId: user.id, provider: account.provider },
          // @ts-ignore
          process.env.NEXTAUTH_SECRET,
          { expiresIn: '1d' }
        );

        const refreshToken = jwt.sign(
          { userId: user.id, provider: account.provider },
          // @ts-ignore
          process.env.NEXTAUTH_SECRET,
          { expiresIn: '7d' }
        );

        token.role = dbUser.role || 'USER';
        token.email = dbUser.email;
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
        token.picture = dbUser.profileImage;
      }
      return token;
    },
    async session({ session, token }:any) {

      // console.log('tokennnn: ', token);
      // Attach access token and refresh token to the session
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.role = token.role;
      session.image = token.picture;
      // console.log('ssssss: ', session)
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  }
});

export { handler as GET, handler as POST };