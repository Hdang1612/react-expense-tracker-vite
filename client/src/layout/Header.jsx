import { ArrowLeftOutlined, SettingOutlined } from '@ant-design/icons' // Import các icon từ ant-design
import { Link } from 'react-router-dom'
function Header() {
  return (
    <div className='flex justify-between items-center px-[24px] py-3 bg-transparent md:p-5  text-black '>
      <Link to='/home' className='flex items-center'>
        <ArrowLeftOutlined className='text-xl md:text-3xl' />
      </Link>

      {/* <h1 className="text-[14px] md:text-2xl font-bold">{ isUpdate ? "Chỉnh sửa" :"Thêm mới" }</h1> */}

      <button className='flex items-center'>
        <SettingOutlined className='text-xl md:text-3xl' />
      </button>
    </div>
  )
}

export default Header
