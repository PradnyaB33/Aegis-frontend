import React, { createContext, useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";

const UseContext = createContext();

export const UseState = (props) => {
  // use useCookies for stored and removed the token
  const [cookies, setCookie, removeCookie] = useCookies(["aegis"]);
  // useLocation to access the location
  const location = useLocation();
   
  // appAlert to display the successfully message on the window
  const [appAlert, setAppAlert] = useState({
    alert: false,
    type: "success",
    msg: "this is success alert",
  });
   
  // for loading purpose
  const [appLoading, setAppLoading] = useState({
    load: false,
    color: "#fff",
  });
  
  // for in progress bar
  const [progress, setProgress] = useState(10);

  return (
    <UseContext.Provider
      value={{
        cookies,
        setCookie,
        removeCookie,
        appAlert,
        setAppAlert,
        appLoading,
        setAppLoading,
        progress,
        setProgress,
        location,
      }}
    >
      {props.children}
    </UseContext.Provider>
  );
};

export { UseContext, UseState as default };
