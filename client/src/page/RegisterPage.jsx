import { useState } from "react";

import RegisterForm from "../component/AuthForm/RegisterForm";
import LoginForm from "../component/AuthForm/LoginForm";
function RegisterPage() {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => {
    setIsLogin(!isLogin);
    console.log("click!!");
  };

  return (
    <div className="bg-[#0F0F0F] w-screen h-screen flex items-center text-[#fff] px-[60px] justify-between">
      <div>
        <p className="text-[96px] font-semibold">Welcome Back .!</p>
        <div className=" bg-transparent border-2 border-inherit px-[24px] py-[14px] w-[236px] text-[28px]">
          Skip the lag ?
        </div>
      </div>
      <div>
        {/* <ForgotPassword/> */}
        {isLogin ? (
          <LoginForm toggleForm={toggleForm} />
        ) : (
          <RegisterForm toggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
