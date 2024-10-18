import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AppContextProvider, useAppContext } from "./context/appContext";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import { Header } from "./layout/Header";
import { ChakraProvider } from "@chakra-ui/react";
import NameForm from "./layout/NameForm";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
               <NameForm/>
              </>
            }
          />
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
