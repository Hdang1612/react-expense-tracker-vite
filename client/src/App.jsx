import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import HomePage from "./page/HomePage";
import Report from "./page/Report";
import RegisterPage from "./page/RegisterPage";
import TransactionPage from "./page/TransactionPage";
function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  console.log(isAuthenticated);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/home"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route path="/auth" element={<RegisterPage />} />
        <Route
          path="/transactions"
          element={
            isAuthenticated ? (
              <TransactionPage />
            ) : (
              <Navigate to="/transactions" />
            )
          }
        />
        <Route
          path="/statistics"
          element={isAuthenticated ? <Report /> : <Navigate to="/statistics" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
