function ForgotPassword() {
  return (
    <div className="border-[#AFAFAF] border-2 rounded-[20px] w-[480px] h-[800px] drop-shadow-md pt-[97px] pb-[20px] px-[40px]">
      <div className="flex flex-col justify-between h-full">
        <div className="">
          <p className="text-[36px] font-semibold">Forgot password ?</p>
          <p className="text-[16px] font-medium">Please enter your email</p>
          <form>
            <div className="mb-6">
              <input
                id="email"
                type="email"
                // value={email}

                className="w-full border border-[#FFFFFF] rounded-md px-[16px] py-[14px] text-[20px] font-regular bg-transparent mt-3"
                placeholder="Email"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#E948C5] via-[#CD407B] to-[#75042D] text-white text-[20px] font-semibold rounded-[12px]"
            >
              Reset Password
            </button>
          </form>
        </div>
        <div className="flex flex-col items-center text-[16px] text-[#626262]">
          <p>
            Dont have account ?{" "}
            <a className="cursor-pointer  hover:text-[#fff]">Signup</a>
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

export default ForgotPassword;
