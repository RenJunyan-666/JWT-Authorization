import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Register from "./views/Register";
import Secret from "./views/Secret";
import "react-toastify/dist/ReactToastify.css"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} exact />
        <Route path="/login" element={<Login />} exact />
        <Route path="/" element={<Secret />} exact />
      </Routes>
    </BrowserRouter>
  );
}
