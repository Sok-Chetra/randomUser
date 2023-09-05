'use client'
import { LayoutContext } from '@/context/LayoutContext';
import React, { InputHTMLAttributes, useContext, useEffect, useRef, useState } from 'react'
import { useLayoutContext } from '../ProviderComponent/LayoutProvider';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
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
   onKeyDown?: any;
}
export const Input: React.FC<InputProps> = ({ 
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
   onKeyDown
}) => {
   const { isShown, setIsShown } = useLayoutContext()
   const inputRef: any = useRef(null);

   useEffect(() => {
      const handleOutsideClick = (event: any) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
          // Click occurred outside the input
            setIsShown(false);
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
               outline-none 
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
            onKeyDown={onKeyDown}
         />
      </div>
      
   )
}
