
import { Layout } from '@/components/GridLayouts/Layout'
import { getData } from '@/libs/data'
import Image from 'next/image'


export default async function Home() {
  const datas = await getData()
  
  return (
    <main className='overflow-hidden antialiased'>
      <Layout datas={datas} />
    </main>
  )
}
