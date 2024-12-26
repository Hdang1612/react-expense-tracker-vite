import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Modal } from "antd";
import {
  DownOutlined,
} from "@ant-design/icons";

import { removeTransactions } from "../../feature/transactionSlice";
import { formatCurrency } from "../../utils/number";

const ExpenseItem = ({
  transaction,
  updateAction,
  openItemId,
  setOpenItemId,
  categoryName,
}) => {
  const {categoriesList}= useSelector ((state)=> state.transactions)

  const BASE_PATH = import.meta.env.VITE_BASE_PATH;
  const isOpen = openItemId === transaction.id;

  const handleToggleDropdown = () => {
    setOpenItemId(isOpen ? null : transaction.id);
  };

  const image = categoryName
    ? categoriesList.find((category) => category.name === categoryName)?.image
    : `upload/categories/1735118176357-unknown_8199110.png`;

  const borderColor =
    transaction.transactionType === "income" ||
    transaction.transactionType === "Income"
      ? "border-r-green-500"
      : transaction.transactionType === "expense" ||
          transaction.transactionType === "Expense"
        ? "border-r-red-500"
        : "";

  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(removeTransactions(transaction.id));
    if (isOpen) setOpenItemId(null);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showImage = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <div
        className={`flex flex-col justify-center p-2 rounded-2xl  shadow-lg mb-3  border-[#EEEFEF] border-[1px] ${borderColor}  border-r-[18px]`}
      >
        <div
          className="flex flex-row items-center cursor-pointer"
          onClick={handleToggleDropdown}
        >
          <div
            className={`w-[47px] h-[47px] flex items-center justify-center  md:w-[70px] md:h-[70px] `}
          >
            <img className="md:w-[60px] md:h-[60px] w-[47px] h-[47px]  rounded-full" src={`${BASE_PATH}${image}`} alt="category"/>
          </div>
          <div className="ml-3">
            <p className="text-[16px] md:text-2xl font-regular text-[#000000]">
              {categoryName}
            </p>
            <p className="text-[12px] md:text-xl font-semibold text-[#AEABAB]">
              {transaction.transactionDescription}
            </p>
          </div>
          <div
            className={`ml-auto text-[16px] md:text-2xl font-semibold ${transaction.transactionType === "income" ? "text-green-500" : "text-red-500"} `}
          >
            {formatCurrency(transaction.transactionAmount)}
          </div>
          <div
            className={`ml-2 md:mx-3 transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            <DownOutlined />
          </div>
        </div>
        <div className={`dropdown-content ${isOpen ? "dropdown-open" : ""}`}>
          <div className="flex mt-2 bg-transparent p-4 rounded-md shadow-lg w-full">
            <div>
              <p className="font-bold mb-2">
                {transaction.transactionType === "income"
                  ? "Income Receipt"
                  : "Expense Receipt"}
              </p>
              {transaction.receipt ? (
                <img
                  src={`${BASE_PATH}${transaction.receipt}`}
                  alt="Receipt"
                  className="object-cover md:w-[200px] md:h-[200px] w-[160px] h-[160px] mb-3 cursor-pointer"
                  onClick={showImage}
                />
              ) : (
                <p className="text-gray-500 text-sm">No receipt </p>
              )}
            </div>
            <div className="flex flex-col space-y-4 w-1/3  md:w-1/5 mt-4 ml-auto mt-[30px]">
              <button
                onClick={updateAction}
                className="bg-[#EF8767] text-white px-4 py-2 rounded-md"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete()}
                className="bg-[#CFBBD4] text-white px-4 py-2 rounded-md mx-0"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        visible={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        width="600px"
        height="600px"
        className=""
      >
        <img
          src={`${BASE_PATH}${transaction.receipt}`}
          alt="Receipt"
          className=""
        />
      </Modal>
    </div>
  );
};

export default ExpenseItem;
