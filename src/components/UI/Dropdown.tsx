'use client'

import React, { useState } from 'react'
import { Button } from './Button'
import { SubDropdown } from './SubDropdown'
import { useLayoutContext } from '../ProviderComponent/LayoutProvider'
import { SubButton } from './SubButton'

type DropdownProps = {
   children: React.ReactNode
}

export const Dropdown = ({ 
   children
}: DropdownProps) => {

   return (
      <div className='z-50'>
         {children}
      </div>
   )
}