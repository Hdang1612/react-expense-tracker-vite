import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getFromStorage } from "./feature/localStorage";
// import { useSelector } from "react-redux";

import HomePage from "./page/HomePage";
import Report from "./page/Report";
import RegisterPage from "./page/RegisterPage";
import TransactionPage from "./page/TransactionPage";
function App() {
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = getFromStorage("token");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route
          path="/home"
          element={token ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route path="/auth" element={<RegisterPage />} />
        <Route
          path="/transactions"
          element={
            token ? <TransactionPage /> : <Navigate to="/auth" />
          }
        />
        <Route
          path="/statistics"
          element={token ? <Report /> : <Navigate to="/auth" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
