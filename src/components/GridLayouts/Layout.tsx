'use client'

import React, { useContext, useEffect, useRef, useState } from 'react'
import { Grid } from './Grid'
import { RowCol } from './RowCol'
import { useLayoutContext } from '../ProviderComponent/LayoutProvider'
import { LayoutContext } from '@/context/LayoutContext'
import Image from 'next/image'
import { Button } from '../UI/Button'
import { SearchBar } from '../UI/SearchBar'
import { Text } from '../UI/Text'
import { format } from 'date-fns';
import { Input } from '../UI/Input'
import Cookies from 'js-cookie'
import { Loading } from '../UI/Loading'
import { Dropdown } from '../UI/Dropdown'
import { DropdownButton } from '../UI/DropdownButton'
import { SubButton } from '../UI/SubButton'

interface LayoutProps {
   datas: any;
}


export const Layout = ({datas}: LayoutProps) => {
   
   const [ isLoading, setLoading ] = useState(true)
   const [ dots, setDots ] = useState(1);
   const [ selectedId, setSelectedId ] = useState(datas.results[0].login.uuid); 
   const [ isCopied, setIsCopied ] = useState(false);   
   const [ userInput, setUserInput ] = useState('')
   const [ uuid, setUUID ] = useState()
   const [ searchedUser, setSearchedUser ] = useState<any[] | null>();
   const { isAuthenticated, setIsAuthenticated } = useLayoutContext()
   const { isClick, setIsClick } = useLayoutContext();
   const { isShown, setIsShown } = useLayoutContext()
   const { sortBy, setSortBy } = useLayoutContext()
   const { setData } = useLayoutContext()
   const inputRef: any = useRef(null);
   const [ isDropdown, setDropdown ]: any = useState<{
      sortByDropdown: boolean;
      genderDropdown: boolean;
      nameDropdown: boolean;
      countryDropdown: boolean;
   }>({
      sortByDropdown: false,
      genderDropdown: false,
      nameDropdown: false,
      countryDropdown: false
   });
  
   // const { data, setData } = useContext(LayoutContext);

   function handleCheckAuth(){
      const data = Cookies.get('auth')
      if(data){
         const storedData = JSON.parse(data);
         setUUID(storedData.uuid);
         setIsAuthenticated(storedData.isAuthenticated);
      }
   }

   function handleClickUser(id: any) {
      setSelectedId(id);
      
   }
   
   function handleClickInput (e: any) {
      e.stopPropagation();
      setIsClick(true);
   }

   const handleCopyText = (uuid: string) => {
      navigator.clipboard.writeText(uuid)
      .then(() => {
         setIsCopied(true)
      })
      .catch((error) => {
        console.error('Copy failed:', error);
      });
      setTimeout(() => {
         setIsCopied(false);
      } , 1000);
      
   }

   function handleShowPassword() {
      setIsShown(true)
   }

   function handleSearchUser(e: React.ChangeEvent<HTMLInputElement>) {
      const searchValue = e.target.value.toLowerCase();
    
      const searchedDataUser = datas.results.filter((data: any) => {
         const searchByUUID = data.login.uuid.toLowerCase();
         const searchByCountry = data.location.country.toLowerCase();
         const searchByTitle = data.name.title.toLowerCase().replace('.', '');
         const searchByFirstName = data.name.first.toLowerCase();
         const searchByLastName = data.name.last.toLowerCase();
         const searchByFullName = `${searchByFirstName} ${searchByLastName}`;
         const searchByFullNameWithTitle = `${data.name.title.toLowerCase().replace('.', '')} ${data.name.last.toLowerCase()} ${data.name.first.toLowerCase()}`;
    
         return (
            searchByUUID.includes(searchValue) ||
            searchByTitle.includes(searchValue) ||
            searchByFirstName.includes(searchValue) ||
            searchByLastName.includes(searchValue) ||
            searchByFullName.includes(searchValue) ||
            searchByFullNameWithTitle.includes(searchValue) ||
            searchByCountry.includes(searchValue)
         );
      });
    
      setSearchedUser(searchValue ? searchedDataUser : null);
      setSortBy(searchValue ? searchedDataUser : null)
   }

   function handleHidePassword(){
      Cookies.remove('auth')
      setIsAuthenticated(false);
   }

   const handleInputSalt = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserInput(e.target.value)
   }

   const handleSubmit = (password: string, uuid: string)=>{
      const data:any = {isAuthenticated:'true', uuid: uuid}
      if(userInput === password){
         console.log('uuid: ' + uuid)
         Cookies.set('auth', JSON.stringify(data));
      }else{
         alert('no matches')
      }
   }

   function handleSortBy(sortWith: string) {
      const currentOrderBy = window.localStorage.getItem('orderBy') || 'asc';
      const newOrderBy = currentOrderBy === 'asc' ? 'desc' : 'asc';
      window.localStorage.setItem('orderBy', newOrderBy);
      window.localStorage.setItem('sortBy', sortWith);
   
      // Sort the entire dataset
      const sortedData = datas.results.sort((a: any, b: any) => {
         const aPropertyValue = getNestedPropertyValue(a, sortWith);
         const bPropertyValue = getNestedPropertyValue(b, sortWith);
   
         if (newOrderBy === 'asc') {
            return aPropertyValue?.localeCompare(bPropertyValue);
         } else {
            return bPropertyValue?.localeCompare(aPropertyValue);
         }
      });
   
      let filteredData = sortedData;
   
      if (sortWith === 'male' || sortWith === 'female') {
         // Filter data to include only 'male' or 'female' records
         filteredData = sortedData.filter((item: any) => item.gender === sortWith);
      } else if(sortWith.startsWith('location.country.')){
         const countryToFilter = sortWith.substring('location.country.'.length);
         filteredData = filterByNestedProperty(sortedData, 'location.country', countryToFilter);
      }
   
      if (filteredData.length > 0) {
         const selectedItem = filteredData[0].login.uuid;
         setSelectedId(selectedItem)
      }

      if (filteredData) {
         setSortBy(filteredData);
      }
   }
   
   
   function filterByNestedProperty(data: any, propertyPath: any, valueToMatch: any) {
      return data.filter((item: any) => {
        const propertyValue = getNestedPropertyValue(item, propertyPath);
        return propertyValue === valueToMatch;
      });
    }

   function getNestedPropertyValue(obj: any, propertyPath: string) {
      const properties = propertyPath.split('.');
      let value = obj;
    
      for (const prop of properties) {
         if (value && value.hasOwnProperty(prop)) {
            value = value[prop];
         } else {
            return undefined; // Property not found, return undefined
         }
      }
      return value;
   };

   const toggleSortByDropdown = () => {
      setDropdown((prevDropdown: any) => ({
         ...prevDropdown,
         sortByDropdown: !prevDropdown.sortByDropdown,
         genderDropdown: false,
         nameDropdown: false,
         countryDropdown: false,
       }));
    };

   const handleGenderMouseOver = () => {
      setDropdown({ 
         genderDropdown: true,
         sortByDropdown: true
      });
   };

   const handleNameMouseOver = () => {
      setDropdown({ 
         nameDropdown: true,
         sortByDropdown: true
      });
   };

   const handleCountryMouseOver = () => {
      setDropdown({ 
         countryDropdown: true,
         sortByDropdown: true
      });
   };

   const handleClickOutside = (e: any) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setDropdown({
            sortByDropdown: false,
         })
      }else {
         return null
      }
   };

   const filteredData = datas.results.filter((data: any) => data.login.uuid === selectedId);
   const birthDateArray = filteredData.map((data: any) => data.dob.date);
   const registeredDate = filteredData.map((data: any) => data.registered.date);
   // Create an array of parsed Date objects from the birthDateArray
   const parsedDates = birthDateArray.map((dateString: string) => new Date(dateString));
   const parsedRegisteredDates = registeredDate.map((dateString: string) => new Date(dateString));

   // Now you can format each parsed date separately
   const readableDate = parsedDates.map((parsedDate: Date) => format(parsedDate, "MMMM d, yyyy")); 
   const readableRegistedDate = parsedRegisteredDates.map((parsedRegisteredDates: Date) => format(parsedRegisteredDates, "MMMM d, yyyy")); 

   useEffect(() => {
      
      if (!isLoading) {
         setDots(0); // Reset dots when loading becomes false
         return;
      }
      setTimeout(() => {
         setLoading(false);
       }, 5000);

      const intervalDot = setInterval(() => {
         setDots((prevDots) => (prevDots < 5 ? prevDots + 1 : 1));
         
      }, 400);

      return ()=>{
         clearInterval(intervalDot);
      };

   }, [ isLoading, isCopied ])

   useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      
      // Clean up the event listener when the component unmounts
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
   }, []);

    useEffect(() => {
      const interval = setInterval(() =>{
         handleCheckAuth()
      }, 1000)
      return ()=>{
         clearInterval(interval);
      };
    },[])

   return (
      <Grid
         width='w-screen'
         height='h-screen'
         className='relative'
      >
         {isLoading ? 
               <Loading dots={dots}/>
            : 
               <>
                  <RowCol 
                     rowSpan='row-span-6'
                     colSpan='col-span-1'
                     bgColor='bg-slate-600'
                     className={`
                        py-5
                        px-3
                        overflow-y-scroll
                        overflow-x-hidden
                        scrollbar-hide
                     `}
                     width='w-full'
                     height='h-full'
                  >
                     {/* Display Sorted Data */}
                     { sortBy  ? 
                        <div 
                           className='
                              flex
                              flex-col
                              w-full
                              gap-6
                           '
                        >
                           { sortBy?.map((sort:any)=>
                              <Button
                                 key={sort.login.uuid}
                                 onClick={()=>handleClickUser(sort.login.uuid)}
                                 className={`
                                    ${sort.login.uuid === selectedId && 
                                       `
                                          rounded-l-full
                                          rounded-tr-xl
                                          scale-125
                                          ease-in-out
                                          delay-200
                                          duration-300
                                          translate-x-11
                                          
                                       `
                                    }
                                    translate-x-8
                                    appearance-none
                                    transition
                                    delay-300
                                    ease-in-out
                                    bg-none
                                    scale-100
                                    duration-300
                                    w-full
                                    rounded-l-full
                                    rounded-r-xl
                                    transform
                                    motion-reduce:transition-none 
                                    motion-reduce:hover:transform-none
                                 `}
                              >
                                 <Image 
                                    key={sort.login.uuid}
                                    src={sort.picture.large} 
                                    alt="thumbnail"
                                    width={70}
                                    height={70}
                                    className={`
                                       ${sort.login.uuid === selectedId ? 
                                          `
                                             rounded-full
                                             scale-110
                                             ease-in-out
                                             delay-200
                                             duration-300
                                             border-slate-950
                                          `
                                          : 
                                          `
                                             border-white
                                          `
                                       }
                                       focus:border-red-800
                                       rounded-full 
                                       aspect-square 
                                       object-cover 
                                       border-4 
                                    `}
                                    quality={100}
                                    priority
                                 />
                              </Button>
                           )
                        }
                        </div>
                     : 
                        // Div for Display all User
                        <div
                           className='
                              flex
                              flex-col
                              w-full
                              gap-6
                           '
                        >
                           {/* Display all User */}
                           { datas.results.map((data:any)=>
                              <Button
                                 key={data.login.uuid}

                                 onClick={()=>handleClickUser(data.login.uuid)}
                                 className={`
                                    ${data.login.uuid === selectedId && 
                                       `
                                          rounded-l-full
                                          rounded-tr-xl
                                          scale-125
                                          ease-in-out
                                          delay-200
                                          duration-300
                                          translate-x-11
                                          
                                       `
                                    }
                                    translate-x-8
                                    appearance-none
                                    transition
                                    delay-300
                                    ease-in-out
                                    bg-none
                                    scale-100
                                    duration-300
                                    w-full
                                    rounded-l-full
                                    rounded-r-xl
                                    transform
                                    motion-reduce:transition-none 
                                    motion-reduce:hover:transform-none
                                 `}
                              >
                                 <Image 
                                    key={data.login.uuid}
                                    src={data.picture.large} 
                                    alt="thumbnail"
                                    width={70}
                                    height={70}
                                    className={`
                                       ${data.login.uuid === selectedId ? 
                                          `
                                             rounded-full
                                             scale-110
                                             ease-in-out
                                             delay-200
                                             duration-300
                                             border-slate-950
                                          `
                                          : 
                                          `
                                             border-white
                                          `
                                       }
                                       focus:border-red-800
                                       rounded-full 
                                       aspect-square 
                                       object-cover 
                                       border-4 
                                    `}
                                    quality={100}
                                    priority
                                 />
                              </Button>
                           )}
                        </div>
                     }
                  </RowCol>
                  <RowCol
                     rowSpan='row-span-6'
                     colSpan='col-span-11'
                  >

                     {filteredData ? (
                        <Grid
                           width='w-full'
                           height='h-full'
                           className='relative'

                        >
                           <RowCol
                              rowSpan='row-span-1'
                              colSpan='col-span-12'
                              bgColor='bg-gray-50'
                              className='
                                 px-20 
                                 pt-8 
                                 relative
                              '
                           >
                              {/* Div for Dropdown and Search Bar Component */}
                              <div 
                                 className='
                                    flex 
                                    items-start
                                    gap-5
                                    relative
                                 '
                              >
                                 <div 
                                    className='
                                       w-full
                                    '
                                 >
                                    <div 
                                       className='
                                          flex 
                                          items-start
                                          gap-10
                                       '
                                    >
                                       {/* Div of Dropdown */}
                                       <div
                                          className='
                                             z-50
                                             rounded-lg
                                             border-2
                                             shadow-xl
                                             border-gray-500
                                             text-white
                                             bg-slate-800
                                          '
                                          ref={inputRef}
                                       >
                                          {/* Sort Dropdown */}
                                          <Dropdown>
                                             <Button
                                                onClick={() =>{
                                                   toggleSortByDropdown();
                                                }}
                                                type='button'
                                                className='
                                                   flex
                                                   items-center
                                                   justify-center
                                                   w-28
                                                   py-2
                                                   px-2
                                                   rounded-lg
                                                   border
                                                   border-opacity-20
                                                   text-center
                                                   text-white
                                                   bg-red-900
                                                '
                                             >
                                                Sort By
                                                {/* Icon arrow down and up */}
                                                { isDropdown.sortByDropdown ?
                                                      // Arrow Up svg
                                                      <svg 
                                                         className='animate-bounce'
                                                         width="25" 
                                                         height="25" 
                                                         fill="currentColor" 
                                                         viewBox="0 0 24 24" 
                                                         xmlns="http://www.w3.org/2000/svg"
                                                      >
                                                         <path 
                                                            fillRule="evenodd" 
                                                            d="M16.53 14.03a.75.75 0 0 1-1.06 0L12 10.56l-3.47 3.47a.75.75 0 0 1-1.06-1.06l4-4a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06Z" 
                                                            clipRule="evenodd"
                                                         >
                                                         </path>
                                                      </svg>
                                                   :
                                                      // Arrow Down svg
                                                      <svg 
                                                         width="25" 
                                                         height="25" 
                                                         fill="currentColor" 
                                                         viewBox="0 0 24 24" 
                                                         xmlns="http://www.w3.org/2000/svg"
                                                      >
                                                         <path 
                                                            fillRule="evenodd" 
                                                            d="M16.53 8.97a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06L12 12.44l3.47-3.47a.75.75 0 0 1 1.06 0Z" 
                                                            clipRule="evenodd"
                                                         >
                                                         </path>
                                                      </svg>
                                                }
                                             </Button>
                                             {/* Sub Menu Sort Dropdown */}
                                             { isDropdown.sortByDropdown && 
                                                <div>
                                                   {/* Sub menu Gender */}
                                                   <DropdownButton
                                                      className='
                                                         mt-1
                                                      '
                                                   >
                                                      {/* Button sort gender ascending and descending */}
                                                      <Button
                                                         onMouseOver={handleGenderMouseOver}
                                                         onClick={()=> {
                                                            setDropdown({ 
                                                               nameDropdown: true,
                                                               sortByDropdown: true
                                                            });
                                                         }}
                                                         className={`
                                                            flex
                                                            items-center
                                                            justify-center
                                                            font-semibold
                                                            text-lg
                                                            w-full
                                                            py-2
                                                            border-b-2
                                                            border-gray-500
                                                            text-red-600
                                                            hover:text-white
                                                            hover:bg-red-900
                                                         `}
                                                      >
                                                         Gender
                                                         {/* Icon arrow down and up */}
                                                         { isDropdown.genderDropdown ?
                                                            // Arrow Up
                                                            <svg 
                                                               className='animate-bounce'
                                                               width="25" 
                                                               height="25" 
                                                               fill="currentColor" 
                                                               viewBox="0 0 24 24" 
                                                               xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                               <path 
                                                                  fillRule="evenodd" 
                                                                  d="M16.53 14.03a.75.75 0 0 1-1.06 0L12 10.56l-3.47 3.47a.75.75 0 0 1-1.06-1.06l4-4a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06Z" 
                                                                  clipRule="evenodd"
                                                               >
                                                               </path>
                                                            </svg>
                                                         :
                                                            // Arrow down
                                                            <svg 
                                                               width="25" 
                                                               height="25" 
                                                               fill="currentColor" 
                                                               viewBox="0 0 24 24" 
                                                               xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                               <path 
                                                                  fillRule="evenodd" 
                                                                  d="M16.53 8.97a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06L12 12.44l3.47-3.47a.75.75 0 0 1 1.06 0Z" 
                                                                  clipRule="evenodd"
                                                               >
                                                               </path>
                                                            </svg>
                                                         }
                                                      </Button>

                                                      {/* Dropdown of Gender */}
                                                      { isDropdown.genderDropdown &&
                                                         <SubButton
                                                            className='
                                                               w-32
                                                               font-semibold
                                                               text-base
                                                               bg-slate-800
                                                            '
                                                         >
                                                            {/* Button Male */}
                                                            <Button
                                                               onClick={()=> {
                                                                  handleSortBy('male');
                                                                  setDropdown({ 
                                                                     genderDropdown: true,
                                                                     sortByDropdown: true
                                                                  });
                                                               }}
                                                               type='button'
                                                               className={`
                                                                  flex
                                                                  items-center
                                                                  justify-center
                                                                  gap-1
                                                                  w-full
                                                                  py-3
                                                                  border-b-2
                                                                  border-gray-500
                                                                  hover:bg-red-800
                                                               `}
                                                            >
                                                               <svg width="25" height="25" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                  <path d="M12 3.75a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z"></path>
                                                                  <path d="M8 13.25A3.75 3.75 0 0 0 4.25 17v1.188c0 .754.546 1.396 1.29 1.517 4.278.699 8.642.699 12.92 0a1.537 1.537 0 0 0 1.29-1.517V17A3.75 3.75 0 0 0 16 13.25h-.34c-.185 0-.369.03-.544.086l-.866.283a7.251 7.251 0 0 1-4.5 0l-.866-.283a1.752 1.752 0 0 0-.543-.086H8Z"></path>
                                                               </svg>
                                                               Male
                                                            </Button>
                                                            {/* Button Female */}
                                                            <Button
                                                               onClick={()=> {
                                                                  handleSortBy('female');
                                                                  setDropdown({ 
                                                                     genderDropdown: true,
                                                                     sortByDropdown: true
                                                                  });
                                                               }}
                                                               className={`
                                                                  flex
                                                                  items-center
                                                                  justify-center
                                                                  gap-1
                                                                  w-full
                                                                  py-3
                                                                  hover:bg-red-900
                                                               `}
                                                            >
                                                               <svg width="25" height="25" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                  <path d="m13.143 5.143 2.286 2.286V8.57a3.429 3.429 0 0 1-6.852.202l-.006-1.344 2.286-1.143 2.286-1.143Z" clipRule="evenodd"></path>
                                                                  <path d="M6.286 13.714V8.571a5.714 5.714 0 0 1 11.428 0v5.143"></path>
                                                                  <path d="M20 18.857v-.832C20 14.383 15.787 12 12 12s-8 2.383-8 6.025v.832C4 19.488 4.512 20 5.143 20h13.714c.631 0 1.143-.512 1.143-1.143Z" clipRule="evenodd"></path>
                                                               </svg>
                                                               Female
                                                            </Button>
                                                         </SubButton>
                                                      }
                                                      
                                                   </DropdownButton>

                                                   {/* Sub menu Name */}
                                                   <DropdownButton>
                                                      {/* Button sub menu Name */}
                                                      <Button
                                                         onMouseOver={handleNameMouseOver}
                                                         onClick={()=> {
                                                            setDropdown({ 
                                                               nameDropdown: true,
                                                               sortByDropdown: true
                                                            });
                                                         }}
                                                         className={`
                                                            flex
                                                            items-center
                                                            justify-center
                                                            w-full
                                                            py-2
                                                            font-semibold
                                                            text-lg
                                                            border-b-2
                                                            border-gray-500
                                                            text-red-600
                                                            hover:text-white
                                                            hover:bg-red-900
                                                         `}
                                                      >
                                                         Name
                                                         {/* Icon Arrow Down and Up */}
                                                         { isDropdown.nameDropdown ?
                                                            // Arrow Up
                                                            <svg 
                                                               className='animate-bounce'
                                                               width="25" 
                                                               height="25" 
                                                               fill="currentColor" 
                                                               viewBox="0 0 24 24" 
                                                               xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                               <path 
                                                                  fillRule="evenodd" 
                                                                  d="M16.53 14.03a.75.75 0 0 1-1.06 0L12 10.56l-3.47 3.47a.75.75 0 0 1-1.06-1.06l4-4a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06Z" 
                                                                  clipRule="evenodd"
                                                               >
                                                               </path>
                                                            </svg>
                                                         :
                                                            // Arrow Down
                                                            <svg 
                                                               width="25" 
                                                               height="25" 
                                                               fill="currentColor" 
                                                               viewBox="0 0 24 24" 
                                                               xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                               <path 
                                                                  fillRule="evenodd" 
                                                                  d="M16.53 8.97a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06L12 12.44l3.47-3.47a.75.75 0 0 1 1.06 0Z" 
                                                                  clipRule="evenodd"
                                                               >
                                                               </path>
                                                            </svg>
                                                         }
                                                      </Button>
                                                      
                                                      {/* Dropdown of Name */}
                                                      { isDropdown.nameDropdown &&
                                                         // Dropdown Buttons
                                                         <SubButton
                                                            className='
                                                               w-32
                                                               font-semibold
                                                               text-base
                                                               bg-slate-800
                                                         '
                                                         >
                                                            {/* Button FirstName */}
                                                            <Button
                                                               onClick={()=> {
                                                                  handleSortBy('name.first');
                                                                  setDropdown({ 
                                                                     nameDropdown: true,
                                                                     sortByDropdown: true
                                                                  });
                                                               }}
                                                               type='button'
                                                               className={`
                                                                  w-full
                                                                  py-3
                                                                  border-b-2
                                                                  border-gray-500
                                                                  hover:bg-red-900
                                                               `}
                                                            >
                                                               FirstName
                                                            </Button>

                                                            {/* Button LastName */}
                                                            <Button
                                                               onClick={()=> {
                                                                  handleSortBy('name.last');
                                                                  setDropdown({ 
                                                                     nameDropdown: true,
                                                                     sortByDropdown: true
                                                                  });
                                                               }}
                                                               className={`
                                                                  w-full
                                                                  py-3
                                                                  hover:bg-red-900
                                                               `}
                                                            >
                                                               LastName
                                                            </Button>
                                                         </SubButton>
                                                      }
                                                   </DropdownButton>

                                                   {/* Sub menu Country */}
                                                   <DropdownButton>
                                                      {/* Button Country */}
                                                      <Button
                                                         onMouseOver={handleCountryMouseOver}
                                                         onClick={()=> {
                                                            setDropdown({ 
                                                               countryDropdown: true,
                                                               sortByDropdown: true
                                                            });
                                                         }}
                                                         className={`
                                                            flex
                                                            items-center
                                                            justify-center
                                                            rounded-b-lg
                                                            w-full
                                                            py-2
                                                            font-semibold
                                                            text-lg
                                                            text-red-600
                                                            hover:text-white
                                                            hover:bg-red-900
                                                         `}
                                                      >
                                                         Country
                                                         {/* Icon Arrow Up and Down */}
                                                         { isDropdown.countryDropdown ?
                                                            // Arrow Up
                                                            <svg 
                                                               className='animate-bounce'
                                                               width="25" 
                                                               height="25" 
                                                               fill="currentColor" 
                                                               viewBox="0 0 24 24" 
                                                               xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                               <path 
                                                                  fillRule="evenodd" 
                                                                  d="M16.53 14.03a.75.75 0 0 1-1.06 0L12 10.56l-3.47 3.47a.75.75 0 0 1-1.06-1.06l4-4a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06Z" 
                                                                  clipRule="evenodd"
                                                               >
                                                               </path>
                                                            </svg>
                                                         :
                                                            // Arrow Down
                                                            <svg 
                                                               width="25" 
                                                               height="25" 
                                                               fill="currentColor" 
                                                               viewBox="0 0 24 24" 
                                                               xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                               <path 
                                                                  fillRule="evenodd" 
                                                                  d="M16.53 8.97a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06L12 12.44l3.47-3.47a.75.75 0 0 1 1.06 0Z" 
                                                                  clipRule="evenodd"
                                                               >
                                                               </path>
                                                            </svg>
                                                         }
                                                      </Button>
                                                      
                                                      {/* Dropdown of Country */}
                                                      { isDropdown.countryDropdown &&
                                                         // Dropdown Buttons
                                                         <SubButton
                                                            className='
                                                               w-32
                                                               font-semibold
                                                               text-base
                                                               bg-slate-800
                                                               max-h-60
                                                               mb-1
                                                               overflow-y-scroll
                                                               scrollbar-hide
                                                            '
                                                         >
                                                            {/* All Country Button */}
                                                            { datas.results.map((country: any) =>
                                                               <Button
                                                                  key={country.login.uuid}
                                                                  onClick={()=> {
                                                                     handleSortBy(`location.country.${country.location.country}`);
                                                                     setDropdown({ 
                                                                        countryDropdown: true,
                                                                        sortByDropdown: true
                                                                     });
                                                                  }}
                                                                  type='button'
                                                                  className={`
                                                                     w-full
                                                                     py-3
                                                                     border-b-2
                                                                     border-gray-500
                                                                     hover:bg-red-900
                                                                  `}
                                                               >
                                                                  { country.location.country }
                                                               </Button>
                                                            )}
                                                         </SubButton>
                                                      }
                                                   </DropdownButton>
                                                </div>
                                             }
                                          </Dropdown>
                                       </div>

                                       {/* Div of Search bar */}
                                       <div
                                          className='
                                             w-full
                                          '
                                       >
                                          {/* Search Component */}
                                          <SearchBar 
                                             inputName='search'
                                             name='search'
                                             type='search'
                                             className={`
                                                border-2 
                                                border-slate-950  
                                                appearance-none
                                                outline-none
                                                px-5
                                                py-1
                                                rounded-full
                                                transition-all 
                                                duration-700
                                                ease-in-out
                                                motion-reduce:transition-none
                                                motion-reduce:hover:transform-none
                                                text-lg 
                                             `} 
                                             onMouseDown={handleClickInput}
                                             onChange={handleSearchUser}
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              
                              <span
                                 className='
                                    mt-5
                                    absolute
                                    w-[100rem]
                                    h-auto
                                    z-50
                                    rounded-2xl
                                    bg-slate-800
                                    snap-y
                                 '
                              >
                                 {/* Div for show result search */}
                                 <div
                                    className='
                                       snap-start
                                       overflow-auto
                                       flex
                                       flex-col
                                       max-h-[480px]
                                       scrollbar-hide
                                       rounded-2xl
                                       gap-0
                                    '
                                 >
                                    {/* Display use that match the search */}
                                    { searchedUser ? searchedUser.map((user:any) => 
                                          // Button Users click to see their info
                                          <Button
                                             key={user.login.uuid}
                                             className={`
                                                hover:bg-gray-300
                                                hover:bg-opacity-10
                                                hover:border-l-8
                                                hover:border-red-700
                                                snap-y
                                             `}
                                             onClick={()=>{
                                                handleClickUser(user.login.uuid)
                                                setSearchedUser([])
                                             }}
                                          >
                                             <div 
                                                className='
                                                   p-5
                                                   flex
                                                   items-center
                                                   gap-5
                                                   snap-start
                                                '
                                             >
                                                <Image
                                                   src={user.picture.large}
                                                   width={100}
                                                   height={100}
                                                   alt={'User Profile'}
                                                   className='
                                                      z-50
                                                      rounded-full
                                                      border-4
                                                      border-red-700
                                                   '
                                                /> 
                                                <p
                                                   className='
                                                      text-xl
                                                      font-semibold
                                                      text-red-700
                                                   '
                                                >
                                                   
                                                   {user.name.title}. {user.name.last} {user.name.first}
                                                </p>
                                             </div>
                                          </Button>
                                       ):
                                          null
                                    }
                                 </div>
                              </span>
                           </RowCol>

                           {/* Show the User information that you click to show */}
                           {filteredData.map((data: any) => (

                              <RowCol
                                 key={data.login.uuid}
                                 rowSpan='row-span-5'
                                 colSpan='col-span-12'
                                 bgColor='bg-slate-950'
                                 className={`
                                    ${isClick ? 'blur-md' : ''} 
                                 `}

                              >
                                 {/* User Profile */}
                                 <span
                                    className={`
                                       absolute 
                                       left-10
                                       ${isClick ? '-top-10': 'top-28'}
                                    `}
                                 >
                                    <Image 
                                       
                                       id={'user-'+data.login.uuid}
                                       width={170}
                                       height={170}
                                       src={data.picture.large}
                                       alt=''
                                       quality={100}
                                       className='
                                          rounded-full 
                                          aspect-square
                                          border-8
                                          border-slate-950
                                       '
                                    />
                                 </span>

                                 {/* Grid for Layout User information to display */}
                                 <Grid
                                    width='w-full'
                                    height='h-full'
                                    className='relative'
                                 >
                                    {/* Email, Username, Tel, Address row */}
                                    <RowCol
                                       rowSpan='row-span-1'
                                       colSpan='col-span-12'
                                    >
                                       {/* Email, Username, Tel, and address location of User */}
                                       <div 
                                          className='
                                             text-white 
                                             absolute 
                                             left-64 
                                             flex 
                                             flex-col
                                             mt-1
                                          '
                                       >
                                          {/* Email, Username, Tel part */}
                                          <div 
                                             className='
                                                flex 
                                                space-x-10
                                             '
                                          >
                                          
                                             {/* Email User section*/}
                                             <div 
                                                className='
                                                   pt-3 
                                                   flex 
                                                   items-center 
                                                   gap-3
                                                '
                                             >
                                                
                                                <svg 
                                                   className='fill-red-700' 
                                                   width="35" 
                                                   height="35" 
                                                   fill="currentColor" 
                                                   viewBox="0 0 24 24" 
                                                   xmlns="http://www.w3.org/2000/svg"
                                                >
                                                   <path 
                                                      fillRule="evenodd" 
                                                      d="M2.804 8.353c-.28 2.603-.268 5.605.122 8.197a3.138 3.138 0 0 0 2.831 2.66l1.51.131c3.15.274 6.317.274 9.466 0l1.51-.13a3.138 3.138 0 0 0 2.831-2.66c.39-2.593.402-5.595.122-8.198a30.68 30.68 0 0 0-.122-.904 3.138 3.138 0 0 0-2.831-2.66l-1.51-.13a54.647 54.647 0 0 0-9.465 0l-1.51.13a3.138 3.138 0 0 0-2.832 2.66 31.1 31.1 0 0 0-.122.904Zm4.593-2.2a53.146 53.146 0 0 1 9.206 0l1.51.131a1.64 1.64 0 0 1 1.478 1.389l.034.233-5.561 3.09a4.25 4.25 0 0 1-4.128 0l-5.56-3.09c.01-.078.022-.156.033-.233a1.638 1.638 0 0 1 1.478-1.389l1.51-.131ZM19.81 9.52a29.099 29.099 0 0 1-.218 6.807 1.638 1.638 0 0 1-1.478 1.389l-1.51.131a53.152 53.152 0 0 1-9.206 0l-1.51-.131a1.638 1.638 0 0 1-1.478-1.389 29.101 29.101 0 0 1-.217-6.807l5.016 2.787a5.75 5.75 0 0 0 5.585 0l5.015-2.787Z" 
                                                      clipRule="evenodd"
                                                   >
                                                   </path>
                                                </svg>
                                                {data.email}
                                             </div>

                                             {/* Username of User section */}
                                             <div className='pt-3 flex items-center gap-3'>
                                                <svg 
                                                   className='stroke-red-700' 
                                                   width="35" 
                                                   height="35" 
                                                   fill="none" 
                                                   stroke="currentColor" 
                                                   strokeLinecap="round" 
                                                   strokeLinejoin="round" 
                                                   strokeWidth="2" 
                                                   viewBox="0 0 24 24" 
                                                   xmlns="http://www.w3.org/2000/svg"
                                                >
                                                   <path 
                                                      d="M12 8a4 4 0 1 0 0 8 4 4 0 1 0 0-8z"
                                                   >
                                                   </path>
                                                   <path 
                                                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10c2.252 0 4.33-.744 6.001-2"
                                                   >
                                                   </path>
                                                   <path 
                                                      d="M16 8v4c0 1 .6 3 3 3s3-2 3-3"
                                                   >
                                                   </path>
                                                </svg>
                                                {data.login.username}
                                             </div>

                                             {/* User Phone number section */}
                                             <div className='pt-3 flex items-center gap-3'>
                                                <svg 
                                                   className='fill-red-700' 
                                                   width="35" 
                                                   height="35" 
                                                   fill="currentColor" 
                                                   viewBox="0 0 24 24" 
                                                   xmlns="http://www.w3.org/2000/svg"
                                                >
                                                   <path 
                                                      fillRule="evenodd" d="M5.84 9.856a17.216 17.216 0 0 0 8.922 8.663l.012.005.764.34a2.25 2.25 0 0 0 2.74-.737l1.274-1.763a.25.25 0 0 0-.046-.341l-2.224-1.795a.25.25 0 0 0-.358.046l-.866 1.168a.75.75 0 0 1-.912.237 13.387 13.387 0 0 1-6.67-6.67.75.75 0 0 1 .237-.912L9.88 7.23a.25.25 0 0 0 .046-.358L8.132 4.648a.25.25 0 0 0-.341-.046l-1.773 1.28a2.25 2.25 0 0 0-.732 2.756l.554 1.217v.001Zm8.33 10.041a18.716 18.716 0 0 1-9.694-9.416v-.002l-.555-1.22A3.75 3.75 0 0 1 5.14 4.666l1.773-1.28a1.75 1.75 0 0 1 2.386.32l1.795 2.225a1.75 1.75 0 0 1-.32 2.505l-.67.496a11.891 11.891 0 0 0 5.118 5.118l.497-.67a1.75 1.75 0 0 1 2.504-.32l2.225 1.795a1.75 1.75 0 0 1 .32 2.387l-1.275 1.764a3.75 3.75 0 0 1-4.565 1.229l-.758-.338Z" 
                                                      clipRule="evenodd"
                                                   >
                                                   </path>
                                                </svg>
                                                {data.phone} / {data.cell}
                                             </div>
                                          </div>

                                          {/* Address and location of user */}
                                          <div className='pt-3 flex items-center gap-3'>
                                             <svg 
                                                className='stroke-red-700' 
                                                width="35" 
                                                height="35" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth="2" 
                                                viewBox="0 0 24 24" 
                                                xmlns="http://www.w3.org/2000/svg"
                                             >
                                                <path d="M12 7a3 3 0 1 0 0 6 3 3 0 1 0 0-6z"></path>
                                                <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z"></path>
                                             </svg>
                                             Street {data.location.street.number} {data.location.street.name}, {data.location.city}, {data.location.state}, {data.location.postcode}, {data.location.country}, Timezone: {data.location.timezone.offset} ( Lat: {data.location.coordinates.latitude}, Lon: {data.location.coordinates.longitude} )
                                          </div>
                                          
                                       </div>
                                    </RowCol>

                                    <RowCol
                                       rowSpan='row-span-5'
                                       colSpan='col-span-12'
                                       className='text-white'
                                    >

                                       <Grid
                                          height='h-full'
                                       >
                                          {/* User information Row */}
                                          <RowCol
                                             rowSpan='row-span-6'
                                             colSpan='col-span-4'
                                             bgColor='bg-slate-900'
                                             className='
                                                p-5
                                                m-5
                                                rounded-xl
                                             '
                                          >
                                             <div 
                                                className='
                                                   text-white
                                                   flex 
                                                   flex-col 
                                                   gap-5
                                                '
                                             >
                                                <div
                                                   className='
                                                      border-b
                                                      border-gray-300
                                                      border-opacity-25
                                                   '
                                                >
                                                   <p
                                                      className='
                                                         text-center
                                                         text-3xl
                                                         font-semibold
                                                         text-red-700
                                                         pb-5
                                                      '
                                                   >
                                                      User Information
                                                   </p>
                                                </div>
                                                <div>
                                                   <div 
                                                      className='
                                                         flex 
                                                         items-center 
                                                         gap-2 
                                                         group 
                                                         relative 
                                                         text-left
                                                         mt-6
                                                      '
                                                   >
                                                      <Text 
                                                         className='text-xl'
                                                         holder='uuid :'
                                                         holderSize='text-lg'
                                                      >
                                                         {data.login.uuid}
                                                      </Text> 
                                                      <Button
                                                         onClick={(e: any)=>{
                                                            e.stopPropagation();
                                                            handleCopyText(data.login.uuid)
                                                         }}
                                                         type='button'
                                                         className='
                                                            flex 
                                                            items-center 
                                                            space-x-10
                                                         '
                                                      >
                                                         <svg 
                                                            className='stroke-red-700' 
                                                            width="25" 
                                                            height="25" 
                                                            fill="none" 
                                                            stroke="currentColor" 
                                                            strokeLinecap="round" 
                                                            strokeLinejoin="round" 
                                                            strokeWidth="2" 
                                                            viewBox="0 0 24 24" 
                                                            xmlns="http://www.w3.org/2000/svg"
                                                         >
                                                            <path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2z"></path>
                                                            <path d="M16 18v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2"></path>
                                                         </svg>
                                                         {isCopied && (
                                                         <span 
                                                            className="
                                                               opacity-100 
                                                               visible 
                                                               absolute 
                                                               z-10 
                                                               w-32 
                                                               p-2 
                                                               text-center 
                                                               text-red-700 
                                                               rounded-lg 
                                                               shadow-lg 
                                                               bg-slate-800 
                                                               text-opacity-100 
                                                               font-bold 
                                                               tooltip
                                                            "
                                                         >
                                                            Copied
                                                            <div 
                                                               className="
                                                                  absolute 
                                                                  top-1 
                                                                  left-0 
                                                                  transform 
                                                                  -translate-x-1/2 
                                                                  w-6 
                                                                  h-6 
                                                                  z-0 
                                                                  rotate-90
                                                               "
                                                            >
                                                               <svg 
                                                                  className='fill-slate-800' 
                                                                  width="30" 
                                                                  height="30" 
                                                                  fill="currentColor" 
                                                                  viewBox="0 0 24 24" 
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                               >
                                                                  <path d="M11.577 16.248 5.822 9.669c-.68-.774-.128-1.99.903-1.99h11.51a1.2 1.2 0 0 1 .904 1.992l-5.755 6.576a1.198 1.198 0 0 1-1.807 0Z"></path>
                                                               </svg>
                                                            </div>
                                                         </span>
                                                      )}
                                                      </Button>
                                                   </div>
                                                </div>
                                                <div>
                                                   <Text
                                                      holder={'name : '}
                                                      holderSize='text-lg'
                                                      className='text-xl'
                                                   >
                                                      {data.name.title}. {data.name.last} {data.name.first}
                                                   </Text>
                                                </div>
                                                <div>
                                                   <Text
                                                      holder={'gender : '}
                                                      holderSize='text-lg'
                                                      className='text-xl'
                                                   >
                                                      {data.gender}
                                                   </Text>
                                                </div>
                                                <div>
                                                   <Text
                                                      holder={'age : '}
                                                      holderSize='text-lg'
                                                      className='text-xl'
                                                   >
                                                      {data.dob.age} year old
                                                   </Text>
                                                </div>
                                                <div>
                                                   <Text
                                                      holder={'bod : '}
                                                      holderSize='text-lg'
                                                      className='text-xl'
                                                   >
                                                      {readableDate}
                                                   </Text>
                                                </div>
                                                <div>
                                                   <Text
                                                      holder={'location : '}
                                                      holderSize='text-lg'
                                                      className='text-xl'
                                                   >
                                                      {data.location.city}, {data.location.state}, {data.location.country}
                                                   </Text>
                                                </div>
                                                <div>
                                                   <Text
                                                      holder={'timezone : '}
                                                      holderSize='text-lg'
                                                      className='text-xl'
                                                   >
                                                      {data.location.timezone.description} ({data.location.timezone.offset})
                                                   </Text>
                                                </div>
                                                <div>
                                                   <Text
                                                      holder={'nat : '}
                                                      holderSize='text-lg'
                                                      className='text-xl'
                                                   >
                                                      {data.nat} ({data.location.country})
                                                   </Text>
                                                </div>
                                             </div>
                                          </RowCol>

                                          {/* About User Row */}
                                          <RowCol
                                             rowSpan='row-span-6'
                                             colSpan='col-span-5'
                                             className='
                                                p-5
                                                my-5
                                             '
                                          >
                                             <div
                                                className='
                                                   border-b
                                                   border-opacity-25
                                                   border-gray-300
                                                '
                                             >
                                                <p 
                                                   className='
                                                      text-center
                                                      text-3xl
                                                      font-semibold
                                                      text-red-700
                                                      pb-5
                                                   '
                                                >
                                                   About User
                                                </p>
                                             </div>
                                             <div
                                                className='mt-7'
                                             >
                                                <p
                                                   className='
                                                      indent-8
                                                      text-xl
                                                      break-words
                                                   '
                                                >
                                                   <b>{data.name.title}. {data.name.last} {data.name.first}</b>, an avid user of our platform, has been actively engaged with our service for {data.registered.age} years. {data.gender === 'male' ? 'He': 'She'} joined our platform in {readableRegistedDate}. {data.gender === 'male' ? 'His': 'Her'} journey on our platform reflects a diverse range of activities, showcasing the versatility of our offerings. From {data.gender === 'male' ? 'his': 'her'}  early days of exploring informative articles and engaging with online courses to enhance {data.gender === 'male' ? 'his': 'her'} professional skills, {data.gender === 'male' ? 'he': 'she'} quickly evolved into an active contributor, regularly sharing insightful content with the community. <b>{data.name.title}. {data.name.last} {data.name.first}</b>'s enthusiasm for networking also shines through {data.gender === 'male' ? 'his': 'her'} consistent participation in our webinars and virtual events, where {data.gender === 'male' ? 'he': 'she'} connects with like-minded individuals and industry experts. {data.gender === 'male' ? 'His': 'Her'} user profile is a testament to {data.gender === 'male' ? 'his': 'her'} commitment to lifelong learning and {data.gender === 'male' ? 'his': 'her'} desire to collaborate with others. <b>{data.name.title}. {data.name.last} {data.name.first}</b> embodies the vibrant and dynamic user community that our service fosters.
                                                </p>
                                             </div>
                                          </RowCol>

                                          {/* Security Row */}
                                          <RowCol
                                             rowSpan='row-span-6'
                                             colSpan='col-span-3'
                                             bgColor='bg-slate-900'
                                             className='
                                                p-5
                                                m-5
                                                rounded-xl
                                             '
                                          >
                                             <div
                                                className='
                                                   border-b
                                                   border-opacity-25
                                                   border-gray-300
                                                '
                                             >
                                                <p
                                                   className='
                                                      text-center
                                                      text-3xl
                                                      font-semibold
                                                      text-red-700
                                                      pb-5
                                                   '
                                                >
                                                   Security
                                                </p>
                                             </div>
                                             <div
                                                className='
                                                   flex
                                                   flex-col
                                                   gap-5
                                                '
                                             >
                                                <div 
                                                   className='
                                                      flex 
                                                      items-center 
                                                      gap-5 
                                                      group 
                                                      relative 
                                                      text-left
                                                      mt-6
                                                   '
                                                >
                                                   <Text
                                                      holderSize='text-xl'
                                                      className='text-lg'
                                                      pass={data.login.password}
                                                      UUID={data.login.uuid}
                                                   >
                                                      <svg 
                                                         className='stroke-red-700' 
                                                         width="23" 
                                                         height="23" 
                                                         fill="none" 
                                                         stroke="currentColor" 
                                                         strokeLinecap="round" 
                                                         strokeLinejoin="round" 
                                                         strokeWidth="2" 
                                                         viewBox="0 0 24 24" 
                                                         xmlns="http://www.w3.org/2000/svg"
                                                      >
                                                         <rect 
                                                            width="18" 
                                                            height="12" 
                                                            x="3" 
                                                            y="10" 
                                                            rx="2"
                                                         >
                                                         </rect>
                                                         <path 
                                                            d="M6 6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4H6V6z"
                                                         >
                                                         </path>
                                                      </svg>
                                                   </Text> 
                                                      { isAuthenticated && uuid === data.login.uuid ? 
                                                      //close eye
                                                      <Button
                                                         onClick={()=>{
                                                            handleHidePassword()
                                                         }}
                                                         type='button'
                                                         className='
                                                            flex 
                                                            items-center 
                                                            space-x-10
                                                         '
                                                      >
                                                         <svg 
                                                            className='stroke-red-700' 
                                                            width="30" 
                                                            height="30" 
                                                            fill="none" 
                                                            stroke="currentColor" 
                                                            strokeLinecap="round" 
                                                            strokeLinejoin="round" 
                                                            strokeWidth="2" 
                                                            viewBox="0 0 24 24" 
                                                            xmlns="http://www.w3.org/2000/svg"
                                                         >
                                                            <path d="M21.257 10.962c.474.62.474 1.457 0 2.076C19.764 14.987 16.182 19 12 19c-4.182 0-7.764-4.013-9.257-5.962a1.692 1.692 0 0 1 0-2.076C4.236 9.013 7.818 5 12 5c4.182 0 7.764 4.013 9.257 5.962z"></path>
                                                            <path d="M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6z"></path>
                                                         </svg>
                                                      
                                                      </Button>
                                                      :
                                                      
                                                      <Button
                                                         onClick={()=>{
                                                            handleShowPassword()
                                                         }}
                                                         type='button'
                                                         className='
                                                            flex 
                                                            items-center 
                                                            space-x-10
                                                         '
                                                      >  
                                                         <svg width="30" height="30" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M2 10s3.5 4 10 4 10-4 10-4"></path>
                                                            <path d="M4 11.645 2 14"></path>
                                                            <path d="m22 14-1.996-2.352"></path>
                                                            <path d="M8.914 13.68 8 16.5"></path>
                                                            <path d="M15.063 13.688 16 16.5"></path>
                                                         </svg>
                                                         {isShown && 
                                                            <span 
                                                               className="
                                                                  opacity-100 
                                                                  visible 
                                                                  absolute
                                                                  w-52 
                                                                  z-10 
                                                                  p-2 
                                                                  text-center 
                                                                  text-red-700 
                                                                  rounded-lg 
                                                                  shadow-lg 
                                                                  bg-slate-800 
                                                                  text-opacity-100 
                                                                  font-bold 
                                                                  tooltip
                                                               "
                                                            >
                                                               <Input 
                                                                  type='text'
                                                                  className='
                                                                     rounded-md
                                                                     px-3
                                                                     w-48
                                                                  '
                                                                  onChange={handleInputSalt}
                                                                  onKeyDown={(e: any)=>{
                                                                     if(e.keyCode === 13){
                                                                        handleSubmit(data.login.password,data.login.uuid)
                                                                        setIsShown(false)
                                                                     }
                                                                  }}
                                                               />
                                                                  
                                                               <div 
                                                                  className="
                                                                     absolute 
                                                                     top-1 
                                                                     left-0 
                                                                     transform 
                                                                     -translate-x-1/2 
                                                                     w-6 
                                                                     h-6 
                                                                     z-0 
                                                                     rotate-90
                                                                  "
                                                               >
                                                                  <svg 
                                                                     className='fill-slate-800' 
                                                                     width="30" 
                                                                     height="30" 
                                                                     fill="currentColor" 
                                                                     viewBox="0 0 24 24" 
                                                                     xmlns="http://www.w3.org/2000/svg"
                                                                  >
                                                                     <path d="M11.577 16.248 5.822 9.669c-.68-.774-.128-1.99.903-1.99h11.51a1.2 1.2 0 0 1 .904 1.992l-5.755 6.576a1.198 1.198 0 0 1-1.807 0Z"></path>
                                                                  </svg>
                                                               </div>
                                                            </span>
                                                         }
                                                      </Button>
                                                   }
                                                   {/* {data.login.password} */}
                                                </div>
                                                <div>
                                                   <Text
                                                      holder={'salt : '}
                                                      holderSize='text-lg'
                                                      className='text-xl'
                                                   >
                                                      {data.login.salt}
                                                   </Text>
                                                </div>
                                                <div>
                                                   <Text
                                                      holder={'md5 : '}
                                                      holderSize='text-lg'
                                                      className='text-xl'
                                                      breakAll='break-all'
                                                   >
                                                      {data.login.md5}
                                                   </Text>
                                                </div>
                                                <div>
                                                   <Text
                                                      holder={'sha1 : '}
                                                      holderSize='text-lg'
                                                      className='text-xl'
                                                      breakAll='break-all'
                                                   >
                                                      {data.login.sha1}
                                                   </Text>
                                                </div>
                                                <div>
                                                   <Text
                                                      holder={'sha256 : '}
                                                      holderSize='text-lg'
                                                      className='text-xl'
                                                      breakAll='break-all'
                                                   >
                                                      {data.login.sha256}
                                                   </Text>
                                                </div>
                                             </div>
                                          </RowCol>
                                       </Grid>
                                    </RowCol>
                                 </Grid>
                              </RowCol>
                           ))}
                        </Grid>
                     ) : (
                        null
                     )}
                  </RowCol>
               </>
         }
      </Grid>
   )
}
