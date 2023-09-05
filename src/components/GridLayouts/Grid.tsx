'use client'
import React from 'react'

interface GridProps {
   children: React.ReactNode, 
   className?: string | undefined, 
   width?: 'w-screen'| 'w-full'| string;
   height?: 'h-screen'| 'h-full'| string;
   onClick?: any;
   ref?: any;
}

export const Grid = ({
   children, 
   className,
   width,
   height,
   onClick,
   ref
}: GridProps) => {
   return (
      <div 
         className={'grid grid-rows-6 grid-cols-12 ' + width + ' ' + height + ' ' + className}
         onClick={onClick}
         ref={ref}
      >
         {children}
      </div>
   )
}
