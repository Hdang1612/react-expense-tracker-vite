import { useDispatch } from 'react-redux'

import { Link, useLocation } from 'react-router-dom'
import {
  BellOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  BarChartOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import { toggleModal, setModalTitle, setTransactionData } from '../feature/modalSlice'
function Menu() {
  const dispatch = useDispatch()
  const location = useLocation()

  const handleOpenAddModal = () => {
    dispatch(toggleModal(true))
    dispatch(setModalTitle('Add Transaction'))
    dispatch(setTransactionData(null))
  }
  const isActive = (path) => location.pathname === path

  return (
    <div className='absolute bottom-0 left-0 w-full bg-[#EDEDED] shadow-lg z-50 py-1 px-5 md:px-[120px]'>
      <div className='flex justify-between items-center'>
        <Link
          className={`flex flex-col w-[60px] md:w-[100px] items-center md:py-3 ${
            isActive('/reminder') ? 'text-[#EF8767]' : ''
          }`}
        >
          <BellOutlined className='text-xl md:text-[24px]' />
          <span className='text-[10px] sm:text-xl'>Reminder</span>
        </Link>
        <Link
          to='/transactions'
          className={`flex flex-col w-[60px] md:w-[100px] items-center md:py-3 ${
            isActive('/transactions') ? 'text-[#EF8767]' : ''
          }`}
        >
          <InfoCircleOutlined className='text-xl md:text-[24px]' />
          <span className='text-[10px] sm:text-xl'>Transactions</span>
        </Link>

        <div
          onClick={handleOpenAddModal}
          className='relative flex flex-col items-center justify-center cursor-pointer'
        >
          <div className='absolute bottom-0 -translate-y-[0px] md:translate-y-[0.5rem]'>
            <div className='w-[49px] h-[49px] md:w-[70px] md:h-[70px] bg-[#EF8767] rounded-full flex items-center justify-center shadow-lg'>
              <PlusOutlined className='text-[#42224A] font-bold text-3xl' />
            </div>
          </div>
        </div>

        <Link
          to='/statistics'
          className={`flex flex-col w-[60px] md:w-[100px] items-center md:py-3 ${
            isActive('/statistics') ? 'text-[#EF8767]' : ''
          }`}
        >
          <BarChartOutlined className='text-xl md:text-[24px]' />
          <span className='text-[10px] sm:text-xl'>Statistic</span>
        </Link>

        <Link
          to='/home'
          className={`flex flex-col w-[60px] md:w-[100px] items-center md:py-3 ${isActive('/home') ? 'text-[#EF8767]' : ''}`}
        >
          <HomeOutlined className='text-xl md:text-[24px]' />
          <span className='text-[10px] sm:text-xl'>Home</span>
        </Link>
      </div>
    </div>
  )
}

export default Menu
