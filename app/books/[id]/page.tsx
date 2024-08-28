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
  console.log("BOOK DATA",book.data);
 
  return {
    title: book?.data?.name,
    openGraph: {
      images: [book?.data?.cover],
    },
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