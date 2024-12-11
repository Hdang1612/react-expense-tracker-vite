import { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import Menu from "../layout/Menu";
import { logout } from "../feature/authSlice";
import ModalExpense from "../component/modal/ModalTransaction";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { formatCurrency } from "../utils/number";
import { fetchTransactions } from "../feature/transactionSlice";

import {
  TodayTransactionsList,
  WeeklyTransactionsList,
  MonthlyTransactionsList,
} from "../component/TransactionList";
function HomePage() {
  const balance = useSelector((state) => state.transactions.totalBalance);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("today");
  const [showBalance, setShowBalance] = useState(true);

  const handleToggleBalance = () => {
    setShowBalance(!showBalance);
  };

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  const modalStatus = useSelector((state) => state.modal);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full  h-[100vh] bg-white relative ">
        <div className="h-full px-4 py-5 sm:px-[18px] sm:py-[22px] ">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans font-normal text-[16px] text-start text-black md:text-2xl">
                Balance
              </p>
              <div className="flex items-center text-[#42224A] ">
                <span className="font-extrabold text-[28px] sm:text-[46px] mr-3">
                  {showBalance
                    ? balance !== null
                      ? formatCurrency(balance)
                      : "0.00"
                    : "**********"}
                </span>
                <button
                  onClick={handleToggleBalance}
                  className="text-[#42224A] "
                >
                  {showBalance ? (
                    <EyeInvisibleOutlined className="text-[20px] md:text-[32px]" />
                  ) : (
                    <EyeOutlined className="text-[20px] md:text-[32px]" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <Link to="/auth" onClick={() => dispatch(logout())}>
                <UserOutlined className="text-xl md:text-[36px] me-5" />
              </Link>
            </div>
          </div>
          <div>
            <div className="flex justify-between mt-4 gap-2 md:gap-5 ">
              <button
                className={`flex-1   ${
                  filter === "today" ? "bg-[#CFBBD4]" : "bg-[#EEEFEF]"
                } text-[#1E1E1E] rounded-[15px] text-sm font-medium md:text-xl md:py-1`}
                onClick={() => handleFilterChange("today")}
              >
                Today
              </button>

              <button
                className={`flex-1   ${
                  filter === "weekly" ? "bg-[#CFBBD4]" : "bg-[#EEEFEF]"
                } text-[#1E1E1E] rounded-[15px] text-sm font-medium md:text-xl md:py-1`}
                onClick={() => handleFilterChange("weekly")}
              >
                Weekly
              </button>

              <button
                className={`flex-1   ${
                  filter === "monthly" ? "bg-[#CFBBD4]" : "bg-[#EEEFEF]"
                } text-[#1E1E1E] rounded-[15px] text-sm font-medium md:text-xl md:py-1`}
                onClick={() => handleFilterChange("monthly")}
              >
                Monthly
              </button>
            </div>
            <div className="mt-4  flex-1  overflow-y-auto">
              {filter === "today" && <TodayTransactionsList />}
              {filter === "weekly" && <WeeklyTransactionsList />}
              {filter === "monthly" && <MonthlyTransactionsList />}
            </div>
          </div>
        </div>
      </div>
      <Menu className="absolute bottom-0 left-0 w-full "></Menu>
      <div>
        {modalStatus.isShow && (
          <ModalExpense
            isVisible={modalStatus.isShow}
            title={modalStatus.title}
            transactionData={modalStatus.transactionData}
          />
        )}
      </div>
    </div>
  );
}

export default HomePage;
