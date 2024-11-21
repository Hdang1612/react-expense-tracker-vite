import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

import Header from "../layout/Header";
import Menu from "../layout/Menu";
import ModalExpense from "../component/modal/ModalTransaction";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Input } from "antd";
import {
  setCurrentPage,
  setItemsPerPage,
  setFilteredTransactions,
} from "../feature/transactionSlice";
import { TransactionListPagination } from "../component/TransactionList";
import { toggleModal, resetTransactionData } from "../feature/modalSlice";
import { transactionCategory } from "../component/constants/constant";

function TransactionPage() {
  const dispatch = useDispatch();
  const { Search } = Input;
  const modalStatus = useSelector((state) => state.modal);
  const {
    currentPage,
    itemsPerPage,
    transactions,
    filteredTransactions,
    searchKeyword,
  } = useSelector((state) => state.transactions);

  const [searchValue, setSearchValue] = useState(searchKeyword);
  const [category, setCategory] = useState("all");
  const [transactionType, setTransactionType] = useState("all");
  const [transactionAmount, setTransactionAmount] = useState("all");

  useEffect(() => {
    const filtered = transactions.filter((transaction) => {
      const isCategoryMatch =
        category === "all" || transaction.category === category;
      const isTypeMatch =
        transactionType === "all" ||
        transaction.transactionType === transactionType;
      const isAmountMatch =
        transactionAmount === "all" ||
        (transactionAmount === "under50000" && transaction.amount < 50000) ||
        (transactionAmount === "50000-200000" &&
          transaction.amount >= 50000 &&
          transaction.amount <= 200000) ||
        (transactionAmount === "200000-500000" &&
          transaction.amount > 200000 &&
          transaction.amount <= 500000) ||
        (transactionAmount === "500000-1000000" &&
          transaction.amount > 500000 &&
          transaction.amount <= 1000000) ||
        (transactionAmount === "over1000000" && transaction.amount > 1000000);
      const isDescriptionMatch = transaction.description
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      return (
        isCategoryMatch && isTypeMatch && isAmountMatch && isDescriptionMatch
      );
    });

    dispatch(
      setFilteredTransactions({
        filteredTransactions: filtered,
        searchKeyword: searchValue,
      }),
    );
    dispatch(setCurrentPage(1));
  }, [
    transactions,
    category,
    transactionType,
    transactionAmount,
    searchValue,
    dispatch,
  ]);


  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchDescription = (value) => {
    if (value.trim() === "") {
      dispatch(
        setFilteredTransactions({
          filteredTransactions: transactions,
          searchKeyword: "",
        }),
      );
    } else {
      const filtered = transactions.filter((transaction) =>
        transaction.description.toLowerCase().includes(value.toLowerCase()),
      );
      dispatch(
        setFilteredTransactions({
          filteredTransactions: filtered,
          searchKeyword: value,
        }),
      );
      dispatch(setCurrentPage(1));
    }
  };
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  const handleTransactionTypeChange = (e) => {
    setTransactionType(e.target.value);
  };
  const handleAmountChange = (e) => {
    setTransactionAmount(e.target.value);
  };


  const handleCloseModal = () => {
    dispatch(toggleModal(false));
    dispatch(resetTransactionData());
  };

  const totalPages =
    filteredTransactions && filteredTransactions.length >= 0
      ? Math.ceil(filteredTransactions.length / itemsPerPage)
      : Math.ceil(transactions.length / itemsPerPage);
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };
  const handleItemsPerPageChange = (e) => {
    dispatch(setItemsPerPage(Number(e.target.value)));
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedTransactions = (
    filteredTransactions && filteredTransactions.length >= 0
      ? filteredTransactions
      : transactions
  ).slice(startIndex, endIndex);

  const pageNumbers = [];
  let startPage = currentPage - 2 > 0 ? currentPage - 2 : 1;
  let endPage = currentPage + 2 <= totalPages ? currentPage + 2 : totalPages;
  if (totalPages > 4) {
    if (currentPage <= 3) {
      endPage = 4;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - 3;
    }
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  const showEllipsisBefore = startPage > 1;
  const showEllipsisAfter = endPage < totalPages;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center ">
      <div className="w-full  h-[100vh] bg-white relative ">
        <Header />
        <div className="px-6 py-4 ">
          <div className="mb-4 flex items-center   justify-between">
            <div>
              <p className="text-2xl font-bold">List Transaction</p>
            </div>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="bg-gray-50 border border-gray-300 rounded-lg py-2 px-3"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
          <div className="mb-5 flex md:flex-row  flex-col md:items-center items-start justify-start gap-5  ">
            <Search
              className="lg:w-1/3 w-full"
              onSearch={handleSearchDescription}
              placeholder="Input description ..."
              value={searchValue}
              onChange={handleInputChange}
            />
            <div className="w-full">
            <select
              className="lg:w-1/6 w-1/3 rounded-[15px] h-[32px] md:h-[40px] md:rounded-full md:text-xl md:ps-5 bg-transparent font-semibold text-[14px] px-3 border-[1px] "
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="all">All Categories</option>
              {transactionCategory.map((item) => (
                <option key={item.type} value={item.type}>
                  {item.type}
                </option>
              ))}
            </select>
            <select
              className="lg:w-1/6 w-1/3 rounded-[15px] h-[32px] md:h-[40px] md:rounded-full md:text-xl md:ps-5 bg-transparent font-semibold text-[14px] px-3 border-[1px]"
              value={transactionType}
              onChange={handleTransactionTypeChange}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              className="lg:w-1/6 w-1/3 rounded-[15px] h-[32px] md:h-[40px] md:rounded-full md:text-xl md:ps-5 bg-transparent font-semibold text-[14px] px-3 border-[1px]"
              value={transactionAmount}
              onChange={handleAmountChange}
            >
              <option value="all">All Amounts</option>
              <option value="under50000">Under 50.000</option>
              <option value="50000-200000">50.000 - 200.000</option>
              <option value="200000-500000">200.000 - 500.000</option>
              <option value="500000-1000000">500.000 - 1000.000</option>
              <option value="over1000000">Over 1.000.000</option>
            </select>

            </div>
          </div>

          <div className="overflow-y-auto h-[520px] md:h-[480px]">
            <TransactionListPagination transactions={paginatedTransactions} />
          </div>
          <div className="mt-6 flex justify-center m-0  space-x-2">
            <div></div>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-lg font-semibold rounded-lg transition-colors duration-200 ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-white border border-gray-300 hover:bg-gray-200"
              }`}
            >
              <ArrowLeftOutlined />
            </button>
            <div className="flex space-x-2">
              {showEllipsisBefore && (
                <span className="px-3 py-2 text-lg font-semibold">...</span>
              )}
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 text-lg font-semibold rounded-lg transition-colors duration-200 ${
                    currentPage === pageNumber
                      ? "bg-blue-500 text-white"
                      : "bg-white border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              {showEllipsisAfter && (
                <span className="px-3 py-2 text-lg font-semibold">...</span>
              )}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-lg font-semibold rounded-lg transition-colors duration-200 ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-white border border-gray-300 hover:bg-gray-200"
              }`}
            >
              <ArrowRightOutlined />
            </button>
          </div>
        </div>
      </div>

      <Menu className="absolute bottom-0 left-0 w-full" />
      {modalStatus.isShow && (
        <ModalExpense
          isVisible={modalStatus.isShow}
          onClose={handleCloseModal}
          title={modalStatus.title}
          transactionData={modalStatus.transactionData}
        />
      )}
    </div>
  );
}
export default TransactionPage;
