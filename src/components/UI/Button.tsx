'use client'
import React, { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
   type?: 'button' | 'submit' | 'reset' | undefined;
   children?: React.ReactNode;
   className?: string | undefined | any;
   formAction?: any;
   onClick?: any;
   disabled?: boolean;
   ref?: any;
   onMouseOver?: any;
}

export const Button = ({ 
   type, 
   children, 
   className, 
   formAction,
   onClick,
   disabled,
   ref,
   onMouseOver
} : ButtonProps) => {
   return (
      <button 
         ref={ref}
         type={ type }
         className={className} 
         formAction={formAction}
         onClick={onClick}
         disabled={disabled}
         onMouseOver={onMouseOver}
      >
         { children }
      </button>
   )
}
