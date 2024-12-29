import React from "react";
import { BrowserRouter, Routes, Route , Navigate} from "react-router-dom";
import UrlInput from "./components/UrlInput";
import './index.css';

const App = () => {
  return (
      <div className="container mt-4">
        <Routes>
          <Route path="/generate" element={<UrlInput />} />
        </Routes>
    </div>
  );
};

const AppWrapper = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default AppWrapper;
