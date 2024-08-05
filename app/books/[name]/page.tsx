"use client"

import { usePathname } from 'next/navigation'
 
export default function Page() {
    const pathname = usePathname();
    return (
    <div className='flex flex-col items-center justify-start p-16 w-screen min-h-screen'>
        {pathname.split("/")[1]}
    </div>
  )
}