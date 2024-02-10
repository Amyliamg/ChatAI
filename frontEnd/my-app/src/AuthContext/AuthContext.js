import { createContext, useContext, useEffect, useState } from "react";
import { checkUserAuthStatusAPI } from "../apis/user/usersAPI";
import { useQuery } from "@tanstack/react-query"; // make a query to the end point

export const AuthContext = createContext(); // createContext from react will use to share the user's authentication status across components


// Part 1 create value for this context
// children: allow any components wrapped by AuthProvider to be rendered within the AuthContext.Provider.
export const AuthProvider = ({ children }) => {

  // by default, the user is not authen
  const [isAuthenticated, setIsAuthenticated] = useState(false); // useState will provide the authenStatus
  //Make request using react query
  // useQuery will give you the status of calling the api
  const { isError, isLoading, data, isSuccess } = useQuery({ // There are 4 status we could access
    queryFn: checkUserAuthStatusAPI,  // function call, and it must return something
    queryKey: ["checkAuth"],  // provide identify, must be unique
  });
  
  //update the authenticated user
  // why using effect? 
  // it will not immediately call, it will call after isSuccess value returned by useQuery changes.
  // avoid race condition. It will call only when the query is finished 
   useEffect(() => {
    if (isSuccess) {
      setIsAuthenticated(data);
    }
  }, [data, isSuccess]);  // useeffect({process, dependences}) 

  //Update the user auth after login
  const login = () => {
    setIsAuthenticated(true);
  };
  //Update the user auth after login
  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
   //AuthContext.Provider is created by createContext(), it is used to pass the information from the container AuthProvider
     <AuthContext.Provider
      value={{ isAuthenticated, isError, isLoading, isSuccess, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Part 2 make it public
//Custom hook, so you could use the method start with "use"
// you could use useAuth() to get the information about: 
// isAuthenticated, isError, isLoading, isSuccess, login, logout 
// used for destructure
export const useAuth = () => {
  return useContext(AuthContext); // a special function that allows you to use state and other React features i
};