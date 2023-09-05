'use client'
import { LayoutContext } from '@/context/LayoutContext';
import React, { InputHTMLAttributes, useContext, useEffect, useRef, useState } from 'react'
import { useLayoutContext } from '../ProviderComponent/LayoutProvider';

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement>{
   type?: 
      'button' | 
      'checkbox' | 
      'color' | 
      'date' | 
      'datetime-local' | 
      'email' | 
      'file' | 
      'hidden' | 
      'image' | 
      'month' | 
      'number' | 
      'password' | 
      'radio' | 
      'range' | 
      'reset' | 
      'search' | 
      'submit' | 
      'tel' | 
      'text' | 
      'time' | 
      'url' | 
      'week'
      ;
   placeholder?: string;
   formAction?: any;
   id?: string;
   inputName?: string;
   min?: number;
   max?: number;
   maxLength?: number;
   size?: number;
   value?: string | number | undefined;
   readonly?: boolean;
   disabled?: boolean;
   multiple?: boolean;
   pattern?: string;
   title?: string;
   required?: boolean;
   step?: number;
   autoFocus?: boolean;
   width?: number;
   height?: number;
   alt?: string;
   src?: string;
   list?: string;
   autoComplete?: string;
   onChange?: any;
   ref?: any;
   onMouseDown?: any;
   onClick?: any;
}
export const SearchBar: React.FC<SearchBarProps> = ({ 
   type, 
   formAction, 
   className, 
   placeholder, 
   id, 
   inputName, 
   min, 
   max, 
   maxLength, 
   size, 
   value, 
   readonly, 
   disabled, 
   multiple, 
   pattern, 
   title, 
   required, 
   step, 
   autoFocus, 
   width, 
   height, 
   alt, 
   src, 
   list, 
   autoComplete,
   onChange,
   ref,
   onMouseDown,
   onClick,
}) => {
   const { isClick, setIsClick } = useLayoutContext()
   const inputRef: any = useRef(null);
   const svgRef: any = useRef(null);

   const handleSvgClick = () => {
      setIsClick(true) // Trigger input's click event
   };

   useEffect(() => {
      const handleOutsideClick = (event: any) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
          // Click occurred outside the input
            setIsClick(false);
        }
      };
  
      document.addEventListener('mousedown', handleOutsideClick);
  
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, []);

   return (
      <div className="relative ">
         <input 
            type={type} 
            formAction={formAction} 
            className={`
               ${isClick ? 
                  `
                     w-full 
                     cursor-text
                  ` : 
                  `
                     w-0
                     cursor-pointer
                  `
               }
               ${className}
            `} 
            placeholder={placeholder} 
            id={id} 
            name={inputName} 
            min={min} 
            max={max} 
            maxLength={maxLength}
            size={size}
            value={value}
            readOnly={readonly}
            disabled={disabled}
            multiple={multiple}
            pattern={pattern}
            title={title}
            required={required}
            step={step}
            autoFocus={autoFocus}
            width={width}
            height={height}
            alt={alt}
            src={src}
            list={list}
            autoComplete={autoComplete}
            onChange={onChange} 
            ref={inputRef}
            onMouseDown={onMouseDown}
            onClick={onClick}
         />
         <span
            className={`
               absolute
               top-1.5
               transition-transform
               ease-in-out 
               duration-700
               w-full
               motion-reduce:transition-none
               motion-reduce:hover:transform-none
               right-10 
               left-2.5
               ${isClick ? 'translate-x-full' : 'translate-x-0'}
            `}
            ref={svgRef}
            onClick={handleSvgClick}
            tabIndex={0}
            role='button'
         >
            <svg
               className={`
                  ${isClick ? 'stroke-slate-950' : 'stroke-slate-950'}
               `}
               width="25"
               height="25"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
               viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path d="M10.5 19a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z"></path>
               <path d="M13.328 7.172A3.988 3.988 0 0 0 10.5 6a3.988 3.988 0 0 0-2.828 1.172"></path>
               <path d="m16.61 16.611 4.244 4.243"></path>
            </svg>
         </span>
      </div>
      
   )
}
