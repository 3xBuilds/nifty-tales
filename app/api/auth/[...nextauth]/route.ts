import User from "@/schemas/userSchema";
import { connectToDB } from "@/utils/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import { walletAuthProvider } from "../../walletAuthProvider/credsProvider";
import { revalidatePath } from "next/cache";


const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    walletAuthProvider,
  ],
  callbacks: {

    async signIn( {user, account} : {user:any, account:any} ) {
      revalidatePath('/', 'layout') 

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
            const user = await User.findOne({name});
            // console.log('----creating user in db');
            if(user){
              const newName = name+Math.ceil(Math.random()*10)+Math.ceil(Math.random()*10)+Math.ceil(Math.random()*10)
              await User.create({
                email,
                username: newName,
              });
            }
            else{
              await User.create({
                email,
                username: name,
              });
            }
            return true;
         }
      }
      
      return true;
    },
    async jwt({ token, user, account }) {

      const dbUser = await User.findOne({
        $or: [
          { email: token.email },
          { wallet: user?.address },
        ]
      });

      if(!dbUser){
        // console.log('----user not found in db');
        return token;
      }

      // Add user id and provider to the token
      if (account?.provider && user) {
        token.provider = account.provider;
        token.id = user.id;
        if (user && 'address' in user) {
          token.walletAddress = user.address;
        }

        // Generate your own access token and refresh token
        const accessToken = jwt.sign(
          { userId: user.id, provider: account.provider },
          // @ts-ignore
          process.env.NEXTAUTH_SECRET,
          { expiresIn: '6h' }
        );

        const refreshToken = jwt.sign(
          { userId: user.id, provider: account.provider },
          // @ts-ignore
          process.env.NEXTAUTH_SECRET,
          { expiresIn: '6h' }
        );
        token.username = dbUser.username;
        token.role = dbUser.role || 'USER';
        token.email = dbUser.email;
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
        token.picture = dbUser.profileImage;
      }
      return token;
    },
    async session({ session, token }:any) {
      // console.log("SESSION",session, token);
      // console.log('tokennnn: ', token);
      // Attach access token and refresh token to the session
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.role = token.role;
      session.image = token.picture;
      session.user = {username: token.username, email:token.email};

      session.walletAddress = token.walletAddress;



      // console.log('ssssss: ', session)
      return session;
    },
    async redirect({ url, baseUrl }) {
      // console.log("METAMASK", baseUrl);
      return `${baseUrl}/explore`
    }
  }
});

export { handler as GET, handler as POST };