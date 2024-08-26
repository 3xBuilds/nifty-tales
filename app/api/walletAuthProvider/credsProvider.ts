import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/schemas/userSchema";
import { ethers } from "ethers";
import { connectToDB } from "@/utils/db";

function verifySignature(message:any, signature:any) {
    try {
      console.log("_________-----__---__WALLET CHANGED SO DISCONNECTED11111 __-----__----_----_--")

      const address = ethers.utils.verifyMessage(message, signature);
      // console.log("MESSAGE", typeof(message), message, "SIG", signature);
      return address;
    } catch (error) {
      console.error('Error verifying signature:', error);
      return null;
    }
  }

  export const walletAuthProvider = CredentialsProvider({
    name: 'Ethereum',
    credentials: {
      message: { label: "Message", type: "text" },
      signature: { label: "Signature", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.message || !credentials?.signature) {
        return null;
      }
  
      const address = verifySignature(credentials.message, credentials.signature);
      const message = JSON.parse(credentials.message);
  
      if (!address) {
        return null;
      }
  
      await connectToDB();
  
      // Check if the user exists in your database
      const user = await User.findOne({ wallet: message.address });
  
      if (user) {
        return {
          id: user._id.toString(),
          address: message.address,
          email: user.email,
          name: user.username,
        };
      } else {
        // If the user doesn't exist, return null
        return null;
      }
    }
  });