import { getToken } from 'next-auth/jwt'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server';

export async function middleware(req: NextApiRequest) {
    const path = req.url;
    console.log("path", path);

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("token", token);

    const publicPaths = path === '/' || path === '/regsiter'

    if(publicPaths && token) {
        return NextResponse.redirect(new URL("/explore", req.url));
    }
    if(publicPaths && !token) {
        return NextResponse.redirect(new URL("/register", req.url));
    }

}

export const config = {
    matcher: ['/', '/explore']
}