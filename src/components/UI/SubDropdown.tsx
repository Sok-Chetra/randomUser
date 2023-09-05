'use client'

import React from 'react'
import { Button } from './Button'

interface SubDropdownProps {
   children: React.ReactNode
   ref?: any
}

export const SubDropdown = ({ 
   children,
   ref
}: SubDropdownProps) => {
   return (
      <div className='relative' ref={ref}>
         {children}
      </div>
   )
}
