import { useState } from "react";
import { useDispatch } from "react-redux";
import { showSuccessToast } from "../untils/Toaste";
import { Modal } from "antd";
import { removeTransaction } from "../redux-toolkit/transactionSlice";
import {
  ShoppingCartOutlined,
  FileTextOutlined,
  DollarCircleOutlined,
  GiftOutlined,
  FileUnknownOutlined,
} from "@ant-design/icons";
import { formatCurrency } from "../untils/number";
export const transactionTypes = [
  { type: "Shopping", icon: <ShoppingCartOutlined /> },
  { type: "Bill", icon: <FileTextOutlined /> },
  { type: "Salary", icon: <DollarCircleOutlined /> },
  { type: "Food", icon: <GiftOutlined /> },
  { type: "Entertainment", icon: <ShoppingCartOutlined /> },
  { type: "Unknown", icon: <FileUnknownOutlined /> },
];

const ExpenseItem = ({ transaction, updateAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const transactionType = transactionTypes.find(
    (type) => type.type === transaction.category,
  );
  const icon = transactionType ? transactionType.icon : null;
  const borderColor =
    transaction.amount > 0
      ? "border-green-500"
      : transaction.amount < 0
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
        <div className="ml-auto text-[16px] md:text-2xl font-semibold text-[#000000]">
          {formatCurrency(transaction.amount)}
        </div>
      </div>
      {isOpen && (
        <div className=" flex mt-2  bg-gray-100 p-4 rounded-md shadow-lg w-full">
          <div>
            <p className="font-bold mb-2">Receipt image</p>

            <img
              src={transaction.receipt}
              alt="Receipt"
              className="object-cover w-[200px] h-[200px] mb-3 cursor-pointer"
              onClick={showImage} // Khi nhấp vào ảnh, mở modal
            />
          </div>

          <div className="flex flex-col space-y-4  w-1/5 mt-4 ml-auto">
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
      )}
      <Modal
        visible={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        width="60%"
        height="60%"
        className=""
      >
        <img src={transaction.receipt} alt="Receipt" className="" />
      </Modal>
    </div>
  );
};

export default ExpenseItem;
