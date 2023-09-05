'use client'

import React from 'react'
import { Button } from './Button'

interface SubDropdownProps {
   children: React.ReactNode
}

export const SubDropdown = ({ 
   children 
}: SubDropdownProps) => {
   return (
      <div className='relative'>
         {children}
      </div>
   )
}
