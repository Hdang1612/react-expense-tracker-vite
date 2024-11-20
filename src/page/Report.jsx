import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import Menu from "../layout/Menu";
import Header from "../layout/Header";
import FilterContainer from "../component/FilterMonth";
import ModalExpense from "../component/modal/ModalTransaction";
import { PieStatisticMonth } from "../component/chart/PieStatistic";
import { PieStatisticGeneral } from "../component/chart/PieStatistic";
import { toggleModal, resetTransactionData } from "../feature/modalSlice";
function Report() {
  const dispatch = useDispatch();
  const [selectedMonth, setSelectedMonth] = useState("Nov");
  const modalStatus = useSelector((state) => state.modal);
  const handleCloseModal = () => {
    dispatch(toggleModal(false));
    dispatch(resetTransactionData());
  };

  const handleFilter = (month) => {
    setSelectedMonth(month);
    console.log(selectedMonth);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full  h-[100vh] bg-white relative border-black border-2">
        <Header />
        <div className="px-4 py-6  text-[14px] font-bold flex flex-col justify-around items-center  sm:flex-row sm:items-start  ">
          <div className=" flex justify-center ">
            <div className="flex flex-col justify-center ">
              <p className="text-center mb-5 text-2xl">Total Expense</p>
              <PieStatisticGeneral></PieStatisticGeneral>
            </div>
          </div>
          <div className="  flex flex-col justify-center mt-0  ">
            <p className="text-center mb-5 text-2xl">Monthly Expense</p>
            <div className="filter-container flex justify-center">
              <FilterContainer onFilter={handleFilter} />
            </div>
            <PieStatisticMonth month={selectedMonth} />
          </div>
        </div>
        <Menu className="absolute bottom-0 left-0 w-full"></Menu>
        {modalStatus.isShow && (
          <ModalExpense
            isVisible={modalStatus.isShow}
            onClose={handleCloseModal}
            title={modalStatus.title}
            transactionData={modalStatus.transactionData}
          />
        )}
      </div>
    </div>
  );
}

export default Report;
