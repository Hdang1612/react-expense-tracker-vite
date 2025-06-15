import Header from '../layout/Header'
import Menu from '../layout/Menu'
function ProfilePage() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='w-full  h-[100vh] bg-white relative border-black border-2 '>
        <Header />
        <div className='flex justify-center'>
          <div className='md:w-1/2 w-full border-2 border-[#000] h-[30rem] flex '>
            <div className=''>
              <img src='../' alt='' />
            </div>
          </div>
        </div>
        <Menu className='absolute bottom-0 left-0 w-full' />
      </div>
    </div>
  )
}

export default ProfilePage
