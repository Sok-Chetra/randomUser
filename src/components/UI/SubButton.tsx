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
            left-20
            z-50 
            ${className}
         `}
         ref={ref}
      >
         {children}
      </span>
   )
}
