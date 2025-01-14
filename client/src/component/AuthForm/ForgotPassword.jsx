import { forgotPassword } from '../../services/authServices'
import { useState } from 'react'
import { showSuccessToast, showErrorToast } from '../../utils/Toaste'
function ForgotPassword({ toggleForm }) {
  const [email, setEmail] = useState('')
  const handleForgot = async (e) => {
    e.preventDefault()

    try {
      const res = await forgotPassword(email)
      showSuccessToast(res.message)
    } catch (err) {
      showErrorToast(err.message)
    }
  }
  return (
    <div className='border-[#AFAFAF] border-[0.1rem] rounded-[2rem] w-max-[48rem] drop-shadow-md pt-[9.7rem] pb-[2rem] px-[4rem]'>
      <div className='flex flex-col justify-between h-full'>
        <div className=''>
          <p className='text-[3.6rem] font-semibold'>Forgot password ?</p>
          <p className='text-[1.6rem] font-medium'>Please enter your email</p>
          <form onSubmit={handleForgot}>
            <div className='mb-6'>
              <input
                id='email'
                type='email'
                onChange={(e) => setEmail(e.target.value)}
                // value={email}
                className='w-full border border-[#FFFFFF] rounded-[1.2rem] px-[1.6rem] py-[1.4rem] text-[2rem] font-regular bg-transparent mt-3'
                placeholder='Email'
                required
              />
            </div>
            <button
              type='submit'
              className='w-full py-3 bg-gradient-to-r mb-[3rem] from-[#E948C5] via-[#CD407B] to-[#75042D] text-white text-[2rem] font-semibold rounded-[1.2rem]'
            >
              Reset Password
            </button>
          </form>
        </div>
        <div className='flex flex-col items-center text-[1.6rem] text-[#626262]'>
          <p>
            Dont have account ? <a className='cursor-pointer  hover:text-[#fff]'>Signup</a>
          </p>
          <div className='flex justify-between w-full mt-2'>
            <a className='cursor-pointer  hover:text-[#fff]'>Term&Condition</a>
            <a className='cursor-pointer  hover:text-[#fff]'>Support</a>
            <a className='cursor-pointer  hover:text-[#fff]'>Customer Care</a>
          </div>
          <div className='mt-6'>
            <a onClick={toggleForm} className='cursor-pointer hover:underline'>
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
