import type { Metadata, ResolvingMetadata } from 'next'
import { BookFetcher } from '@/components/fetcher/bookFetcher';
import axios from 'axios';
 
type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id
  // console.log(id);

  const book = await fetch(`https://niftytales.vercel.app/api/book/${id}`).then((res) => res.json())
  // console.log("BOOK DATA",book.data);
 
  return {
    title: book?.data?.name,
    openGraph: {
      title: book?.data?.name,
      description: 'Empowering Authors, Engaging Readers',
      url: `https://niftytales.vercel.app/books/${id}`,
      siteName: 'Nifty Tales',
      images: [
        {
          url: book.data.cover, // Must be an absolute URL
          width: 800,
          height: 600,
        },
        {
          url: book.data.cover, // Must be an absolute URL
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
 
export default function Page() {
    return (
      <>
    <div className=''>
       <BookFetcher/>
    </div>
      </>
  )
}