import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

import Header from '../layout/Header'
import Menu from '../layout/Menu'
import ModalExpense from '../component/modal/ModalTransaction'
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import {
  setCurrentPages,
  setFilteredTransactions,
  filterTransaction,
  fetchAllCategory,
  fetchTransactions,
} from '../feature/transactionSlice'
import { TransactionListPagination } from '../component/TransactionList'
import { toggleModal, resetTransactionData } from '../feature/modalSlice'

function TransactionPage() {
  const dispatch = useDispatch()
  const { Search } = Input
  const modalStatus = useSelector((state) => state.modal)
  const {
    currentPage,
    itemsPerPage,
    transactions,
    filteredTransaction,
    totalPage,
    refresh,
    categoriesList,
  } = useSelector((state) => state.transactions)
  const categories = useSelector((state) => state.transactions.categoriesList)

  const [searchValue, setSearchValue] = useState()
  const [itemPerPage, setItemPerPage] = useState(itemsPerPage)
  const [currentP, setCurrentP] = useState(currentPage)
  const [pageNumbers, setPageNumbers] = useState([])
  const [category, setCategory] = useState('all')
  const [transactionType, setTransactionType] = useState('all')
  const [uPrice, setuPrice] = useState(10000000)
  const [dPrice, setdPrice] = useState(0)
  const [showEllipsisBefore, setShowEllipsisBefore] = useState(false)
  const [showEllipsisAfter, setShowEllipsisAfter] = useState(false)

  const handleAmountChange = (e) => {
    const selectedValue = e.target.value
    switch (selectedValue) {
      case 'under50000':
        setuPrice(50000)
        break
      case '50000-200000':
        setdPrice(50000)
        setuPrice(200000)
        break
      case '200000-500000':
        setdPrice(200000)
        setuPrice(500000)
        break
      case '500000-1000000':
        setdPrice(500000)
        setuPrice(1000000)
        break
      case 'over1000000':
        setdPrice(1000000)
        setuPrice(10000000)
        break
      default:
        setdPrice(0)
        setuPrice(10000000)
        break
    }
  }
  const params = {
    des: searchValue,
    cate: category == 'all' ? '' : category,
    type: transactionType == 'all' ? '' : transactionType,
    page: currentP,
    limit: itemPerPage,
    uprice: uPrice,
    dprice: dPrice,
  }

  useEffect(() => {
    dispatch(fetchTransactions())
    dispatch(fetchAllCategory())
    dispatch(filterTransaction(params))
    const pageNumbers = []
    let startPage = currentP - 2 > 0 ? currentP - 2 : 1
    let endPage = currentP + 2 <= totalPage ? currentP + 2 : totalPage
    if (totalPage > 4) {
      if (currentP <= 3) {
        endPage = 4
      } else if (currentP >= totalPage - 2) {
        startPage = totalPage - 3
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }
    setShowEllipsisBefore(startPage > 1)
    setShowEllipsisAfter(endPage < totalPage)
    setPageNumbers(pageNumbers)
  }, [currentP, totalPage, refresh])

  const handleFilter = () => {
    setCurrentP(1)
    const updatedParams = {
      ...params,
      page: 1,
    }
    dispatch(setCurrentPages(1))
    dispatch(filterTransaction(updatedParams))
  }
  const handleInputChange = (e) => {
    setSearchValue(e.target.value)
  }

  const handleSearchDescription = (value) => {
    if (value.trim() === '') {
      dispatch(
        setFilteredTransactions({
          filteredTransaction: transactions,
        })
      )
    } else {
      const filtered = transactions.filter((transaction) =>
        transaction.description.toLowerCase().includes(value.toLowerCase())
      )
      dispatch(
        setFilteredTransactions({
          filteredTransaction: filtered,
        })
      )

      dispatch(setCurrentPages(1))
    }
  }
  const handleCategoryChange = (e) => {
    setCategory(e.target.value)
  }
  const handleTransactionTypeChange = (e) => {
    setTransactionType(e.target.value)
  }

  const handleCloseModal = () => {
    dispatch(toggleModal(false))
    dispatch(resetTransactionData())
  }

  const handlePageChange = (page) => {
    setCurrentP(page)
  }
  const handleItemsPerPageChange = (e) => {
    const newLimit = Number(e.target.value)
    setItemPerPage(newLimit)
    setCurrentP(1)
    dispatch(setCurrentPages(1))

    const updatedParams = {
      ...params,
      page: 1,
      limit: newLimit,
    }
    dispatch(filterTransaction(updatedParams))
  }

  const paginatedTransactions =
    filteredTransaction && filteredTransaction.length >= 0 ? filteredTransaction : transactions

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center '>
      <div className='w-full  h-[100vh] bg-white relative '>
        <Header />
        <div className='px-6 py-4 '>
          <div className='mb-4 flex items-center   justify-between'>
            <div>
              <p className='text-2xl font-bold'>List Transaction</p>
            </div>
            <select
              id='itemsPerPage'
              value={itemPerPage}
              onChange={handleItemsPerPageChange}
              className='bg-gray-50 border border-gray-300 rounded-xl py-2 px-3'
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
          <div className='mb-5 flex xl:flex-row  flex-col xl:items-center items-start justify-start gap-5  '>
            <Search
              className='xl:w-min-[40rem] xl:w-1/3 w-full'
              onSearch={handleSearchDescription}
              placeholder='Input description ...'
              value={searchValue}
              onChange={handleInputChange}
            />
            <div className='w-full flex gap-3 '>
              <select
                className=' xl:w-1/4  w-1/3 rounded-[1.5rem] h-[3.2rem] xl:h-[4rem] xl:rounded-full xl:text-[1.6rem] xl:ps-5 bg-transparent font-semibold text-[1.2rem] px-3 border-[0.1rem] '
                value={category}
                onChange={handleCategoryChange}
              >
                <option value='all'>All Categories</option>
                {categoriesList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <select
                className=' xl:w-1/4  w-1/3 rounded-[1.5rem]  h-[3.2rem] xl:h-[4rem] xl:rounded-full xl:text-[1.6rem] xl:ps-5 bg-transparent font-semibold text-[1.2rem] px-3 border-[0.1rem]'
                value={transactionType}
                onChange={handleTransactionTypeChange}
              >
                <option value='all'>All Types</option>
                <option value='income'>Income</option>
                <option value='expense'>Expense</option>
              </select>
              <select
                className=' xl:w-1/4  w-1/3 rounded-[1.5rem] h-[3.2rem] xl:h-[4rem] xl:rounded-full xl:text-[1.6rem] xl:ps-5 bg-transparent font-semibold text-[1.2rem] px-3 border-[0.1rem]'
                onChange={handleAmountChange}
              >
                <option value='all'>All Amounts</option>
                <option value='under50000'>Under 50.000</option>
                <option value='50000-200000'>50.000 - 200.000</option>
                <option value='200000-500000'>200.000 - 500.000</option>
                <option value='500000-1000000'>500.000 - 1000.000</option>
                <option value='over1000000'>Over 1.000.000</option>
              </select>
              <button
                className='bg-[#CFBBD4] xl:w-1/6  w-1/3 rounded-[1.5rem]  h-[3.2rem] xl:h-[4rem] xl:rounded-full xl:text-[1.6rem] xl:ps-5 font-semibold text-[1.2rem] px-3 border-[0.1rem]'
                onClick={handleFilter}
              >
                Lọc
              </button>
            </div>
          </div>
          <div className='overflow-y-auto h-[40rem] xl:h-[40rem]'>
            <TransactionListPagination
              transactions={paginatedTransactions}
              categories={categories}
            />
          </div>
          <div className='mt-6 flex justify-center m-0  space-x-2'>
            <div></div>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-xl font-semibold rounded-xl transition-colors duration-200 ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-white border border-gray-300 hover:bg-gray-200'
              }`}
            >
              <ArrowLeftOutlined />
            </button>
            <div className='flex space-x-2'>
              {showEllipsisBefore && <span className='px-3 py-2 text-xl font-semibold'>...</span>}
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 text-xl font-semibold rounded-xl transition-colors duration-200 ${
                    currentPage === pageNumber
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              {showEllipsisAfter && <span className='px-3 py-2 text-xl font-semibold'>...</span>}
            </div>
            <button
              onClick={() => handlePageChange(currentP + 1)}
              disabled={currentP === totalPage}
              className={`px-4 py-2 text-xl font-semibold rounded-xl transition-colors duration-200 ${
                currentP === totalPage
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-white border border-gray-300 hover:bg-gray-200'
              }`}
            >
              <ArrowRightOutlined />
            </button>
          </div>
        </div>
      </div>

      <Menu className='absolute bottom-0 left-0 w-full' />
      {modalStatus.isShow && (
        <ModalExpense
          isVisible={modalStatus.isShow}
          onClose={handleCloseModal}
          title={modalStatus.title}
          transactionData={modalStatus.transactionData}
        />
      )}
    </div>
  )
}
export default TransactionPage
