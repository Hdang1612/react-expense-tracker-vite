import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../feature/authSlice";
import { Spin } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { showSuccessToast, showErrorToast } from "../../utils/Toaste";
function LoginForm({ toggleForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const status = useSelector((state) => state.auth.status);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(loginUser({ email, password })).unwrap(); //unwrap để trả về payload của action
      showSuccessToast(res.message);
      navigate("/home");
    } catch (err) {
      showErrorToast(err);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <div className="border-[#AFAFAF] border-2 rounded-[20px] w-[480px] h-[800px] drop-shadow-md pt-[97px] pb-[20px] px-[40px]">
      <div className="flex flex-col justify-between h-full">
        <div className="">
          <p className="text-[36px] font-semibold">Login</p>
          <p className="text-[16px] font-medium">Glad you are back!</p>
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full border border-[#FFFFFF] rounded-md px-[16px] py-[14px] text-[20px] font-regular bg-transparent mt-3"
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-6 flex border items-center border-[#FFFFFF] rounded-md pe-3 ">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="w-full   px-[16px] py-[14px] text-[20px] font-regular bg-transparent focus:outline-none "
                pattern="^.{6,}$"
                title="Password must be at least 6 characters long ."
                placeholder="Password"
                required
              />
              <span onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <EyeOutlined className="text-[20px] md:text-[20px]" />
                ) : (
                  <EyeInvisibleOutlined className="text-[20px] md:text-[20px]" />
                )}
              </span>
            </div>
            <div className="mb-6 flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="w-4 h-4 mr-2 accent-[#8740CD]"
              />
              <label htmlFor="remember-me" className="text-white text-[16px]">
                Remember me
              </label>
            </div>
            <div className="flex items-center flex-col gap-3 mb-[47px]">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#628EFF] via-[#8740CD] to-[#580475] text-white text-[20px] font-semibold rounded-[12px]"
                disabled={status === "loading"} 
              >
                {status === "loading" ? ( 
                  <Spin indicator={<EyeInvisibleOutlined />} />
                ) : (
                  "Login"
                )}
              </button>
              <a>Forgot password ?</a>
            </div>
            <div className="flex items-center my-6">
              <hr className="flex-grow border-t border-[#AFAFAF]" />
              <span className="mx-5 text-[#4D4D4D] text-[16px]">OR</span>
              <hr className="flex-grow border-t border-[#AFAFAF]" />
            </div>
          </form>
        </div>
        <div className="flex flex-col items-center text-[16px] text-[#626262]">
          <p>
            Dont have account ?{" "}
            <a
              onClick={toggleForm}
              className="cursor-pointer  hover:text-[#fff]"
            >
              Login
            </a>
          </p>
          <div className="flex justify-between w-full mt-2">
            <a className="cursor-pointer  hover:text-[#fff]">Term&Condition</a>
            <a className="cursor-pointer  hover:text-[#fff]">Support</a>
            <a className="cursor-pointer  hover:text-[#fff]">Customer Care</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
