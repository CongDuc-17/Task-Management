import "./App.css";

import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { NotFound } from "./pages/NotFound";

import { Dashboard } from "./pages/Dashboard";
import { Board } from "./pages/Board";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />

      <Route path="/boards/:boardId" element={<Board />} />
    </Routes>
  );
}

export default App;
