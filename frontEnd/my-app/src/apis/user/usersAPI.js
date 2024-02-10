import axios from "axios"; // used for making HTTP requests.


// react will handle the error for us
//=======Registration=====

export const registerAPI = async (userData) => {
  const response = await axios.post(
    "http://localhost:8090/api/v1/users/register",
    {
      email: userData?.email,
      password: userData?.password,
      username: userData?.username,
    },
    {
      withCredentials: true, // this will send the cookie in the user browser 
    }
  );
  return response?.data;
};
//=======Login=====

export const loginAPI = async (userData) => {
  const response = await axios.post(
    "http://localhost:8090/api/v1/users/login",
    {
      email: userData?.email,
      password: userData?.password,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};
//=======Check auth=====

export const checkUserAuthStatusAPI = async () => {
  const response = await axios.get(
    "http://localhost:8090/api/v1/users/auth/check",// get don't need payload
    {
      withCredentials: true,
    }
  );
  return response?.data;
};
//=======Logout =====

export const logoutAPI = async () => {
  const response = await axios.post(
    "http://localhost:8090/api/v1/users/logout",
    {},
    {
      withCredentials: true,
    }
  );
  return response?.data;
};
//=======Get Info =====

export const getUserProfileAPI = async () => {
  const response = await axios.get(
    "http://localhost:8090/api/v1/users/profile",

    {
      withCredentials: true,
    }
  );
  return response?.data;
};