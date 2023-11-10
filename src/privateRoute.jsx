import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";

export const SessionContext = React.createContext();

export const PrivateRoute = ({ children }) => {
  const session = useContext(SessionContext);
  const [tokenCheckComplete, setTokenCheckComplete] = useState(false);
  const [token, setToken] = useState(null);

  // Set token when session changes
  useEffect(() => {
    if (session) {
      const tokenFromCookie = getCookie("token");
      setToken(tokenFromCookie);
      setTokenCheckComplete(true);
    }
  }, [session]); // Note that session is now a dependency

  if (!tokenCheckComplete) {
    // Token hasn't been checked yet, don't render anything
    console.log("token check not complete");
    return null;
  } else if (token) {
    // Token exists, render children
    return <>{children}</>;
  } else {
    // No token, redirect to login
    return <Navigate to='/' replace />;
  }
};

export const createCookie = function (name, value, days) {
  let expires;
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toGMTString();
  } else {
    expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
};

export const deleteCookie = (name) => {
  document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

function getCookie(cName) {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf(cName + "=");
    if (cStart !== -1) {
      cStart = cStart + cName.length + 1;
      let cEnd = document.cookie.indexOf(";", cStart);
      if (cEnd === -1) {
        cEnd = document.cookie.length;
      }
      return decodeURIComponent(document.cookie.substring(cStart, cEnd));
    }
  }
  return "";
}
