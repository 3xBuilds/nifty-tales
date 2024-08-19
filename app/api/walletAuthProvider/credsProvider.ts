import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/schemas/userSchema";
import { ethers } from "ethers";
import { connectToDB } from "@/utils/db";

function verifySignature(message:any, signature:any) {
    try {
      const address = ethers.utils.verifyMessage(message, signature);
      console.log("MESSAGE", message, "SIG", signature);
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

    // Verify the Ethereum signature here
    // You'll need to implement this function
    const address = verifySignature(credentials.message, credentials.signature);

    console.log("AFTER VERIFY SIGNATURE", address);

    await connectToDB()

    if (!address) {
      return null;
    }

    console.log("TYPE", typeof(address), address);

    // Check if the user exists in your database
    var user = await User.findOne({ wallet: address });

    console.log("after finding")

    if (!user) {
        console.log("Creating user");
      // Create a new user if they don't exist
      user = await User.create({
        wallet: address,
        email: `${address.slice(0,6)}@wallet`, 
        username: `${address.slice(0, 6)}`, // placeholder username
      });

      console.log("Created");
    }

    return {
      id: user._id.toString(),
      address: address,
      email: user.email,
      name: user.username,
    };
  }
});