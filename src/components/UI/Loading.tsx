'use client'

import React from 'react'

export const Loading = ({dots}: any) => {
   return (
      <span 
         className='
            absolute 
            top-96 
            flex 
            justify-center 
            items-center 
            w-full
         '
         >
         <p 
            className='
               px-5 
               py-3 
               bg-amber-900 
               text-xl 
               text-white
               font-semibold
               rounded-lg
               flex items-center
               gap-2
            '
         >
            <svg 
               className='animate-spin' 
               width="30" 
               height="30" 
               fill="currentColor" 
               viewBox="0 0 24 24" 
               xmlns="http://www.w3.org/2000/svg"
            >
               <path d="m10.15 15-2.108 3.72a.32.32 0 0 0-.03.247.333.333 0 0 0 .158.197c2.334 1.305 5.327 1.305 7.66 0a.33.33 0 0 0 .157-.197.319.319 0 0 0-.03-.247L13.85 15a3.023 3.023 0 0 1-1.85.625c-.7 0-1.342-.234-1.85-.625Z"></path>
               <path d="M10.425 8.864 8.257 5.178a.32.32 0 0 0-.2-.149.33.33 0 0 0-.248.038c-2.297 1.369-3.794 3.96-3.83 6.633a.33.33 0 0 0 .091.235c.06.063.142.098.23.098l4.275.035a3.023 3.023 0 0 1 .384-1.914 3.023 3.023 0 0 1 1.466-1.29Z"></path>
               <path d="m15.425 12.138 4.275-.034a.32.32 0 0 0 .23-.098.33.33 0 0 0 .09-.235c-.036-2.674-1.532-5.266-3.828-6.633a.33.33 0 0 0-.25-.039.319.319 0 0 0-.2.15l-2.167 3.685a3.023 3.023 0 0 1 1.466 1.29c.35.605.468 1.28.384 1.914Z"></path>
               <path d="M14.5 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"></path>
               <path fillRule="evenodd" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 1c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" clipRule="evenodd"></path>
            </svg>
            Loading{'.'.repeat(dots)}
         </p>
      </span>
   )
}
