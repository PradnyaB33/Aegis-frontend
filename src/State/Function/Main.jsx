import React, { createContext, useContext } from "react";
import { UseContext } from "../UseState/UseContext";

const TestContext = createContext();

const TestState = (props) => {
  // to get the setAppAlert or setAppLoading from UseContext
  const { setAppAlert, setAppLoading } = useContext(UseContext);
  
  // create the handleAlert function 
  const handleAlert = (alert, type, msg) => {
    setAppAlert({
      alert: alert || false,
      type: type || "success",
      msg: msg,
    });
  };
  
  // crate the handleLoader function
  const handleLoader = (load, color) => {
    setAppLoading({
      load: load || true,
      color: color || "#fff",
    });
    setTimeout(() => {
      setAppLoading({
        load: false,
      });
    }, 2000);
  };

  return (
    <TestContext.Provider value={{ handleAlert, handleLoader }}>
      {props.children}
    </TestContext.Provider>
  );
};

export { TestContext, TestState as default };
