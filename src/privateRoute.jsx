import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

export const PrivateRoute = ({ element: Element, ...rest }) => {
  //   let token = getCookie("token");
  return (
    <>
      <Route
        {...rest}
        element={false ? <Element /> : <Navigate to='/' replace />}
      />
    </>
  );
};

function getCookie(c_name) {
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(c_name + "=");
    if (c_start !== -1) {
      c_start = c_start + c_name.length + 1;
      let c_end = document.cookie.indexOf(";", c_start);
      if (c_end === -1) {
        c_end = document.cookie.length;
      }
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}
