'use client'

import React from 'react'
import { Button } from './Button'

interface SubDropdownProps {
   children: React.ReactNode
   ref?: any
   className?: string
}

export const SubDropdown = ({ 
   children,
   ref,
   className
}: SubDropdownProps) => {
   return (
      <div className={'relative' + ' ' + className} ref={ref}>
         {children}
      </div>
   )
}
