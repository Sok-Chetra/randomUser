'use client'
import React from 'react'

interface RowColProps {
   children: React.ReactNode | any;
   bgColor?: string;
   className?: string;
   borderRadius?: string;
   color?: string;
   ref?: any;
   rowSpan?: 
            'row-span-1'| 
            'row-span-2'| 
            'row-span-3'| 
            'row-span-4'| 
            'row-span-5'| 
            'row-span-6'
            ;

   colSpan?:
            'col-span-1'| 
            'col-span-2'| 
            'col-span-3'| 
            'col-span-4'| 
            'col-span-5'| 
            'col-span-6'| 
            'col-span-7'| 
            'col-span-8'| 
            'col-span-9'| 
            'col-span-10'| 
            'col-span-11'| 
            'col-span-12'
            ;
   display?: 
            'flex'| 
            'inline'| 
            'block'| 
            'inline-block'| 
            'inline-flex'| 
            'table'| 
            'inline-table'| 
            'table-caption'| 
            'table-cell'| 
            'table-column'| 
            'table-column-group'| 
            'table-footer-group'| 
            'table-header-group'| 
            'table-row-group'| 
            'table-row'| 
            'flex-root'| 
            'grid'| 
            'inline-grid'| 
            'contents'|
            'list-item'| 
            'hidden'
            ;

   direction?: 
             'flex-row'| 
             'flex-col'|
            'flex-wrap'
            ;
   height?: 
            'h-auto'|
            'h-full'|
            'h-screen'|
            string
            ;
   width?: 
            'auto'|
            'screen'|
            'full'|
            string
            ;
}

export const RowCol: React.FC<RowColProps> = ({
   children, 
   bgColor, 
   rowSpan, 
   colSpan, 
   direction, 
   display ,
   height,
   width,
   className,
   borderRadius,
   color,
   ref
}) => {
   return (
      <div
         className={ 
            rowSpan + ' ' + 
            colSpan + ' ' + 
            bgColor + ' ' + 
            direction + ' ' + 
            display + ' ' + 
            height + ' ' + 
            width + ' ' + 
            className + ' ' + 
            borderRadius + ' ' + 
            color
         }
         ref={ref}
      >
         {children}
      </div>
   )
}
