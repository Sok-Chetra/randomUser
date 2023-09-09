import { createContext } from "react";

interface LayoutProviderProps{
   data: any;
   isClick: any;
   isShown: any;
   isAuthenticated: any;
   sortBy: any;
   setIsAuthenticated: React.Dispatch<React.SetStateAction<any>>;
   setIsShown: React.Dispatch<React.SetStateAction<any>>;
   setIsClick: React.Dispatch<React.SetStateAction<any>>;
   setData: React.Dispatch<React.SetStateAction<any>>;
   setSortBy: React.Dispatch<React.SetStateAction<any>>;
}
export const LayoutContext = createContext<LayoutProviderProps>({
   data: {},
   isClick: {},
   isShown: {},
   isAuthenticated: {},
   setIsAuthenticated: ()=>{},
   setIsShown: () => {},
   setIsClick: () =>{},
   setData: () => {},
   sortBy: {},
   setSortBy: ()=>{},
 });