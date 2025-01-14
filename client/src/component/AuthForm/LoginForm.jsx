import { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { loginUser } from '../../feature/authSlice'
import { Spin } from 'antd'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { showSuccessToast, showErrorToast } from '../../utils/Toaste'
function LoginForm({ toggleForm, forgotPassword }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const status = useSelector((state) => state.auth.status)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await dispatch(loginUser({ email, password })).unwrap() //unwrap để trả về payload của action
      showSuccessToast(res.message)
      navigate('/home')
    } catch (err) {
      showErrorToast(err)
    }
  }
  const [showPassword, setShowPassword] = useState(false)
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }
  return (
    <div className='border-[#AFAFAF] border-[0.1rem] rounded-[2rem] drop-shadow-md w-max-[48rem] pt-[9.7rem] pb-[2rem] px-[4rem]'>
      <div className='flex flex-col justify-between h-full'>
        <div className=''>
          <p className='text-[3.6rem] font-semibold '>Login</p>
          <p className='text-[1.6rem] font-medium'>Glad you are back!</p>
          <form onSubmit={handleLogin}>
            <div className='mb-6'>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                className='w-full border border-[#FFFFFF] rounded-[1.2rem] px-[1.6rem] py-[1.4rem] text-[2rem] font-regular bg-transparent mt-3'
                placeholder='Email'
                required
              />
            </div>
            <div className='mb-6 flex border items-center border-[#FFFFFF] rounded-[1.2rem] pe-3 '>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                className='w-full px-[1.6rem]    py-[1.4rem] text-[2rem] font-regular bg-transparent focus:outline-none '
                pattern='^.{6,}$'
                title='Password must be at least 6 characters long .'
                placeholder='Password'
                required
              />
              <span onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <EyeOutlined className='text-[1.6rem] md:text-[2rem]' />
                ) : (
                  <EyeInvisibleOutlined className='text-[1.6rem] md:text-[2rem]' />
                )}
              </span>
            </div>
            <div className='mb-6 flex items-center'>
              <input id='remember-me' type='checkbox' className='w-4 h-4 mr-2 accent-[#8740CD]' />
              <label htmlFor='remember-me' className='text-white text-[1.6rem]'>
                Remember me
              </label>
            </div>
            <div className='flex items-center flex-col gap-3 mb-[4.7rem]'>
              <button
                type='submit'
                className='w-full py-3 bg-gradient-to-r from-[#628EFF] via-[#8740CD] to-[#580475] text-white text-[2rem] font-semibold rounded-[1.2rem]'
                disabled={status === 'loading'}
              >
                {status === 'loading' ? ( // Nếu đang loading, hiển thị spinner
                  <Spin indicator={<EyeInvisibleOutlined />} />
                ) : (
                  'Login'
                )}
              </button>
              <a className='cursor-pointer text-[1.6rem] hover:text-[#fff]' onClick={forgotPassword}>
                Forgot password ?
              </a>
            </div>
            <div className='flex items-center my-6'>
              <hr className='flex-grow border-t border-[#AFAFAF]' />
              <span className='mx-5 text-[#4D4D4D] text-[1.6rem]'>OR</span>
              <hr className='flex-grow border-t border-[#AFAFAF]' />
            </div>
          </form>
        </div>
        <div className='flex flex-col items-center text-[1.6rem] font-noto text-[#626262]'>
          <p>
            Dont have account ?{' '}
            <a onClick={toggleForm} className='cursor-pointer  hover:text-[#fff]'>
              SignUp
            </a>
          </p>
          <div className='flex justify-between w-full mt-2 gap-3'>
            <a className='cursor-pointer  hover:text-[#fff]'>Term&Condition</a>
            <a className='cursor-pointer  hover:text-[#fff]'>Support</a>
            <a className='cursor-pointer  hover:text-[#fff]'>Customer Care</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
