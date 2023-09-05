'use client'

import React from 'react'
import { Button } from './Button'

interface SubButtonProps {
   children: React.ReactNode
}

export const SubButton = ({
   children
}: SubButtonProps) => {
   return (
      <span
         className='
            absolute 
            left-20
            w-28
            z-50
            bg-blue-900
         '
      >
         {children}
      </span>
   )
}
