'use server'

export async function getData() {
   const res = await fetch('https://randomuser.me/api/?results=20',{
     next: {revalidate: 60}
   })
 
   if (!res.ok) {
     // This will activate the closest `error.js` Error Boundary
     throw new Error('Failed to fetch data')
   }
  
   return res.json()
 }