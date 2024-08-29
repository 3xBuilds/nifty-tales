import AuthorFetcher from "@/components/fetcher/authorFetcher";
import type { Metadata, ResolvingMetadata } from 'next'
import { BookFetcher } from '@/components/fetcher/bookFetcher';
import axios from 'axios';
 
type Props = {
  params: { wallet: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.wallet

  const user = await fetch(`https://niftytales.xyz/api/user/wallet/${id}`).then((res) => res.json())
 
  return {
    title: user?.user?.collectionName,
    openGraph: {
      title: user?.user?.collectionName,
      url: `https://niftytales.xyz/authors/${id}`,
      siteName: 'Nifty Tales',
      images: [
        {
          url: `https://niftytales.s3.us-east-1.amazonaws.com/users/${id}/info/profileImage`, // Must be an absolute URL
          width: 800,
          height: 600,
        },
        {
          url: `https://niftytales.s3.us-east-1.amazonaws.com/users/${id}/info/profileImage`, // Must be an absolute URL
          width: 1800,
          height: 1600,
          alt: 'My custom alt',
        },
        
      ],
      locale: 'en_US',
    type: 'website',
  }
}
}

export default function Home(){

    return(
        <div className="">
            <AuthorFetcher/>
        </div>
    )
}