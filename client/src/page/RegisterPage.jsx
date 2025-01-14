import { useState } from 'react'

import RegisterForm from '../component/AuthForm/RegisterForm'
import LoginForm from '../component/AuthForm/LoginForm'
import ForgotPassword from '../component/AuthForm/ForgotPassword'
function RegisterPage() {
  const [formType, setFormType] = useState('login')

  const showLoginForm = () => setFormType('login')
  const showSignupForm = () => setFormType('signup')
  const showForgotPasswordForm = () => setFormType('forgotPassword')

  return (
    <div className='bg-[#0F0F0F] w-screen h-screen flex items-center text-[#fff] px-[60px] xl:justify-between justify-center'>
      <div className='xl:block hidden '>
        <p className='text-[96px] font-semibold'>Welcome Back .!</p>
        <div className=' bg-transparent border-2 border-inherit px-[24px] py-[14px] w-[236px] text-[28px]'>
          Skip the lag ?
        </div>
      </div>
      <div>
        {formType === 'login' && (
          <LoginForm toggleForm={showSignupForm} forgotPassword={showForgotPasswordForm} />
        )}
        {formType === 'signup' && <RegisterForm toggleForm={showLoginForm} />}
        {formType === 'forgotPassword' && <ForgotPassword toggleForm={showLoginForm} />}
      </div>
    </div>
  )
}

export default RegisterPage
