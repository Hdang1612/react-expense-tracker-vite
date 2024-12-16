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
          element={token ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="/auth" element={<RegisterPage />} />
        <Route
          path="/transactions"
          element={token ? <TransactionPage /> : <Navigate to="/auth" />}
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
