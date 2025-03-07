import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route,  Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import GameLogin from "./components/GameLogin";

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
              <GameLogin />
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
