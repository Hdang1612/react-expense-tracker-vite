import { useState } from "react";
import { useDispatch } from "react-redux";

import { showSuccessToast } from "../../utils/Toaste";
import { Modal } from "antd";
import { removeTransaction } from "../../feature/transactionSlice";
import { transactionTypes } from "./transactionType";
import { DownOutlined } from "@ant-design/icons";
import { formatCurrency } from "../../utils/number";
import "./style.css";

const ExpenseItem = ({ transaction, updateAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const transactionType = transactionTypes.find(
    (type) => type.type === transaction.category,
  );
  const icon = transactionType ? transactionType.icon : null;

  const borderColor =
    transaction.transactionType === "income"
      ? "border-green-500"
      : transaction.transactionType === "expense"
        ? "border-red-500"
        : "";

  const dispatch = useDispatch();
  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = () => {
    dispatch(removeTransaction(transaction.id));
    showSuccessToast("Xóa thành công");
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
        className={`flex items-center p-2 rounded-2xl cursor-pointer shadow-lg mb-3 ${borderColor} border-r-[18px]`}
        onClick={handleToggleDropdown}
      >
        <div
          className={`w-[47px] h-[47px] flex items-center justify-center rounded-full text-black bg-[#CFBBD4] text-[20px] md:w-[70px] md:h-[70px] md:text-[30px]  `}
        >
          {icon}
        </div>
        <div className="ml-3">
          <p className="text-[16px] md:text-2xl font-regular text-[#000000]">
            {transaction.category}
          </p>
          <p className="text-[12px] md:text-xl font-semibold text-[#AEABAB]">
            {transaction.description}
          </p>
        </div>
        <div
          className={`ml-auto text-[16px] md:text-2xl font-semibold ${transaction.transactionType === "income" ? "text-green-500" : "text-red-500"} `}
        >
          {formatCurrency(transaction.amount)}
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
        <div className="flex mt-2 bg-gray-100 p-4 rounded-md shadow-lg w-full">
          <div>
            <p className="font-bold mb-2">Receipt image</p>
            {transaction.receipt ? (
              <img
                src={transaction.receipt}
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
      <Modal
        visible={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        width="600px"
        height="600px"
        className=""
      >
        <img src={transaction.receipt} alt="Receipt" className="" />
      </Modal>
    </div>
  );
};

export default ExpenseItem;
