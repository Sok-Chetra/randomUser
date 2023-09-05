'use client'
import React, { useEffect, useState } from 'react'
import { useLayoutContext } from '../ProviderComponent/LayoutProvider';
import Cookies from 'js-cookie';

interface TextProps{
   children?: React.ReactNode;
   className?: string;
   color?: string;
   border?: string;
   holder?: any;
   ref?: any;
   holderSize?:string;
   pass?: any;
   UUID?: string;
   breakAll?: 'break-all';
}

export const Text = ({ 
   children, 
   className,
   color, 
   border,
   holder,
   ref,
   holderSize,
   pass,
   UUID,
   breakAll
}: TextProps) => {
   const { isAuthenticated, setIsAuthenticated } = useLayoutContext()
   const [ uuid, setUUID ] = useState()

   const data = Cookies.get('auth')

   const PasswordToStars = () =>{
      const dottedPassword = '*'.repeat(pass.length);
      return dottedPassword;
   };

   useEffect(() => {
      if(data){
         const storedData = JSON.parse(data);
         setUUID(storedData.uuid);
         setIsAuthenticated(storedData.isAuthenticated);
      }
     
      // setIsAuthenticated();
   });

   return (
      <div className='flex gap-2 font-sans'>
         {holder &&
            <div className='flex flex-none items-start'>
               <p className={'font-medium text-red-700 uppercase break-words ' + holderSize }>
                  {holder}
               </p>
            </div>
         } 
         <div 
            className={
               className + 
               ' ' +
               color + 
               ' ' + 
               border +
               '&nbsp; flex items-end justify-start gap-3 '
            }
            ref={ref}
         >
            <div>
               <p
                  className={breakAll + ' '}
               >
                  {children}
               </p>
            </div>
            <div>
               { pass ? 
                  <p>
                     {isAuthenticated === 'true' && uuid === UUID ? pass: <PasswordToStars />}
                  </p>
               : null}
            </div>
         </div>
      </div>
   )
}
 