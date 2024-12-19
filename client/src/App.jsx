import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import HomePage from "./page/HomePage";
import Report from "./page/Report";
import RegisterPage from "./page/RegisterPage";
import TransactionPage from "./page/TransactionPage";
import ForbiddenPage from "./page/ForbiddenPage";
import ResetPassword from "./page/ResetPassword";
function App() {
  const token = useSelector((state) => state.auth.isAuthenticated);
  const errorConfirm = useSelector((state) => state.transactions.error);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterPage />} />

        <Route
          path="/auth/reset-password/:email/:token"
          element={<ResetPassword />}
        />

        <Route
          path="/home"
          element={
            errorConfirm ? (
              <Navigate to="/forbidden" />
            ) : token ? (
              <HomePage />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route path="/forbidden" element={errorConfirm ? <ForbiddenPage/> : <Navigate to="/home"/>} />
        <Route path="/auth" element={<RegisterPage />} />
        <Route
          path="/transactions"
          element={
            errorConfirm ? (
              <Navigate to="/forbidden" />
            ) : token ? (
              <TransactionPage />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route
          path="/statistics"
          element={
            errorConfirm ? (
              <Navigate to="/forbidden" />
            ) : token ? (
              <Report />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
