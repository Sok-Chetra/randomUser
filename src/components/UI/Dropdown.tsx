'use client'

import React, { useState } from 'react'
import { Button } from './Button'
import { DropdownButton } from './DropdownButton'
import { useLayoutContext } from '../ProviderComponent/LayoutProvider'
import { SubButton } from './SubButton'

type DropdownProps = {
   children: React.ReactNode
   className?: string
}

export const Dropdown = ({ 
   children,
   className
}: DropdownProps) => {

   return (
      <div className={'z-50' + ' ' + className}>
         {children}
      </div>
   )
}