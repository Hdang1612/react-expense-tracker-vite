function RegisterForm({ toggleForm }) {
  return (
    <div className="border-[#AFAFAF] border-2 rounded-[20px] w-[480px] h-[800px] drop-shadow-md pt-[97px] pb-[20px] px-[40px]">
      <div className="flex flex-col justify-between h-full">
        <div className="">
          <p className="text-[36px] font-semibold">Signup</p>
          <p className="text-[16px] font-medium">
            Just some details to get you in.!
          </p>
          <form>
            <div className="mb-2">
              <input
                id="name"
                type="text"
                className="w-full border border-[#FFFFFF] rounded-md px-[16px] py-[10px] text-[20px] font-regular bg-transparent mt-3"
                placeholder="Name"
                required
              />
            </div>
            <div className="mb-2">
              <input
                id="email"
                type="email"
                className="w-full border border-[#FFFFFF] rounded-md px-[16px] py-[10px] text-[20px] font-regular bg-transparent mt-3"
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-2">
              <input
                id="phone_number"
                type="number"
                className="w-full border border-[#FFFFFF] rounded-md px-[16px] py-[10px] text-[20px] font-regular bg-transparent mt-3"
                placeholder="Phone Number"
                required
              />
            </div>

            <div className="mb-2">
              <input
                id="password"
                type="password"
                className="w-full border border-[#FFFFFF] rounded-md px-[16px] py-[10px] text-[20px] font-regular bg-transparent mt-3"
                placeholder="Password"
                required
              />
            </div>
            <div className="mb-2">
              <input
                id="confirm_password"
                type="password"
                className="w-full border border-[#FFFFFF] rounded-md px-[16px] py-[10px] text-[20px] font-regular bg-transparent mt-3"
                placeholder="Confirm Password"
                required
              />
            </div>

            <div className="flex items-center flex-col gap-3 mt-6 ">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#2E4CEE] via-[#221EBF] to-[#040F75] text-white text-[20px] font-semibold rounded-[12px]"
              >
                Signup
              </button>
            </div>
            <div className="flex items-center my-3 ">
              <hr className="flex-grow border-t border-[#AFAFAF]" />
              <span className="mx-5 text-[#4D4D4D] text-[16px]">OR</span>
              <hr className="flex-grow border-t border-[#AFAFAF]" />
            </div>
          </form>
        </div>
        <div className="flex flex-col items-center text-[16px] text-[#626262]">
          <a onClick={toggleForm} className="cursor-pointer  hover:text-[#fff]">
            Login
          </a>
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

export default RegisterForm;
