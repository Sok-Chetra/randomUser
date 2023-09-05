'use client'

import React from 'react'
import { Button } from './Button'

type SubButtonProps = {
   children: React.ReactNode
   className?: string
   ref?: any
}

export const SubButton = ({
   children,
   className,
   ref
}: SubButtonProps) => {
   return (
      <span
         className={`
            absolute 
            top-0
            left-28
            border-2
            border-gray-500
            z-50 
            ${className}
         `}
         ref={ref}
      >
         {children}
      </span>
   )
}
