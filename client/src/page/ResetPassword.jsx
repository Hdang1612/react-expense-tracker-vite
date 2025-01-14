import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { resetPassword } from '../services/authServices'
import { showSuccessToast, showErrorToast } from '../utils/Toaste'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'

const ResetPassword = () => {
  const { email, token } = useParams()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      showErrorToast('Passwords do not match')
      return
    }
    console.log(email)
    console.log('token', token)

    try {
      const res = await resetPassword(password, email, token)
      showSuccessToast(res.message)
      navigate('/auth')
    } catch (err) {
      showErrorToast(err.message)
    }
  }

  return (
    <div className='bg-[#0F0F0F] w-screen h-screen flex items-center text-[#fff] px-[60px] justify-between'>
      <div>
        <p className='text-[96px] font-semibold'>Welcome Back .!</p>
        <div className=' bg-transparent border-2 border-inherit px-[24px] py-[14px] w-[236px] text-[28px]'>
          Skip the lag ?
        </div>
      </div>
      <div className='border-[#AFAFAF] border-2 rounded-[20px] w-[480px] h-[800px] drop-shadow-md pt-[97px] pb-[20px] px-[40px]'>
        <div className='flex flex-col justify-between h-full'>
          <div className=''>
            <p className='text-[36px] font-semibold'>Reset Password</p>
            <p className='text-[16px] font-medium'>Enter your new password</p>
            <form onSubmit={handleResetPassword}>
              <div className='mb-3 flex border items-center border-[#FFFFFF] rounded-md pe-3 mt-3 '>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                  className='w-full   px-[16px] py-[14px] text-[20px] font-regular bg-transparent focus:outline-none '
                  pattern='^.{6,}$'
                  title='Password must be at least 6 characters long .'
                  placeholder='Password'
                  required
                />
                <span onClick={togglePasswordVisibility}>
                  {showPassword ? (
                    <EyeOutlined className='text-[20px] md:text-[20px]' />
                  ) : (
                    <EyeInvisibleOutlined className='text-[20px] md:text-[20px]' />
                  )}
                </span>
              </div>
              <div className='mb-6 flex border items-center border-[#FFFFFF] rounded-md pe-3 '>
                <input
                  id='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className='w-full   px-[16px] py-[14px] text-[20px] font-regular bg-transparent focus:outline-none '
                  placeholder='Confirm Password'
                  required
                />
                <span onClick={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? (
                    <EyeOutlined className='text-[20px] md:text-[20px]' />
                  ) : (
                    <EyeInvisibleOutlined className='text-[20px] md:text-[20px]' />
                  )}
                </span>
              </div>
              <button
                type='submit'
                className='w-full py-3 bg-gradient-to-r from-[#E948C5] via-[#CD407B] to-[#75042D] text-white text-[20px] font-semibold rounded-[12px]'
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
