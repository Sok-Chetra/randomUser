'use client'
import { LayoutContext } from '@/context/LayoutContext';
import React, { useContext, useState } from 'react'


export const useLayoutContext = () => useContext(LayoutContext);

export const LayoutProvider = ({
   children
}: {children: React.ReactNode}) => {
   const [ data, setData ] = useState<any[]>();
   const [ isClick, setIsClick ] = useState(false)
   const [ isShown, setIsShown ] = useState(false)
   const [ sortBy, setSortBy ] = useState<any[] | null>(null);
   const [ isAuthenticated, setIsAuthenticated ] = useState();
   return (
      <LayoutContext.Provider 
         value={{ 
            data, 
            setData, 
            isClick, 
            setIsClick, 
            isShown, 
            setIsShown, 
            isAuthenticated, 
            setIsAuthenticated, 
            sortBy,
            setSortBy
         }}
      >
         {children}
      </LayoutContext.Provider>
   )
}
