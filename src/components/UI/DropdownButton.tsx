'use client'

import React from 'react'
import { Button } from './Button'

interface DropdownButtonProps {
   children: React.ReactNode
   ref?: any
   className?: string
}

export const DropdownButton = ({ 
   children,
   ref,
   className
}: DropdownButtonProps) => {
   return (
      <div className={'relative' + ' ' + className} ref={ref}>
         {children}
      </div>
   )
}
