import { useDispatch, useSelector } from 'react-redux'

import { ArrowRightOutlined,ArrowLeftOutlined } from '@ant-design/icons'
import { setCurrentPage, setItemsPerPage } from '../redux-toolkit/transactionSlice'
import Header from '../layout/Header'
import Menu from '../layout/Menu'
import { TransactionListPagination } from '../component/TransactionList'
import ModalExpense from '../component/modal/ModalTransaction'
import { toggleModal, resetTransactionData } from '../redux-toolkit/modalSlice'

function TransactionPage() {
  const dispatch = useDispatch()
  const modalStatus = useSelector((state) => state.modal)
  const { currentPage, itemsPerPage, transactions } = useSelector((state) => state.transactions)
  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page))
  }

  const handleItemsPerPageChange = (e) => {
    dispatch(setItemsPerPage(Number(e.target.value)))
  }
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTransactions = transactions.slice(startIndex, endIndex)

  const handleCloseModal = () => {
    dispatch(toggleModal(false))
    dispatch(resetTransactionData())
  }
    const pageNumbers = []
    let startPage = currentPage - 2 > 0 ? currentPage - 2 : 1
    let endPage = currentPage + 2 <= totalPages ? currentPage + 2 : totalPages
    if (totalPages > 4) {
      if (currentPage <= 3) {
        endPage = 4
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }
    const showEllipsisBefore = startPage > 1
    const showEllipsisAfter = endPage < totalPages
  
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
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className='bg-gray-50 border border-gray-300 rounded-lg py-2 px-3'
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>

          <div className='overflow-y-auto h-[600px] md:h-[500px]'>
            <TransactionListPagination transactions={paginatedTransactions} />
          </div>
          <div className='mt-6 flex md:ml-[47%] ml-[33%] space-x-2'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-lg font-semibold rounded-lg transition-colors duration-200 ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-white border border-gray-300 hover:bg-gray-200'
              }`}
            >
              <ArrowLeftOutlined />
            </button>
            <div className='flex space-x-2'>
              {showEllipsisBefore && (
                <span className='px-3 py-2 text-lg font-semibold'>...</span>
              )}
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 text-lg font-semibold rounded-lg transition-colors duration-200 ${
                    currentPage === pageNumber
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              {showEllipsisAfter && (
                <span className='px-3 py-2 text-lg font-semibold'>...</span>
              )}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-lg font-semibold rounded-lg transition-colors duration-200 ${
                currentPage === totalPages
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
