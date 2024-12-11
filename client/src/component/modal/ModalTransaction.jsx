import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Modal, Button, Upload } from "antd";

import { showSuccessToast, showErrorToast } from "../../utils/Toaste.js";
import { toggleModal, resetTransactionData } from "../../feature/modalSlice.js";
import { transactionCategory } from "../constants/constant.js";
import {
  updateTransaction,
  removeTransaction,
  addTransactions,
} from "../../feature/transactionSlice.js";

const ModalExpense = () => {
  const dispatch = useDispatch();
  const { isShow, title, transactionData } = useSelector(
    (state) => state.modal,
  );

  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Shopping");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [isExpense, setIsExpense] = useState(true);
  const [uploadError, setUploadError] = useState(false);
  useEffect(() => {
    if (transactionData) {
      setDate(transactionData.date || "");
      setCategory(transactionData.category || "Shopping");
      setDescription(transactionData.description || "");
      setAmount(transactionData.amount || "");
      setIsExpense(transactionData.transactionType === "income" ? false : true);
      setReceipt(transactionData.receipt || null);
    } else {
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
    }
  }, [transactionData]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]+$/.test(value)) {
      setAmount(value);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith("image/")) {
      showErrorToast("Chỉ cho phép upload tệp ảnh ");
      setUploadError(true);
      return;
    }

    try {
      const fileBase64 = await convertToBase64(file);
      setReceipt(fileBase64);
      setUploadError(false);
    } catch (error) {
      setUploadError(true);
      console.error("Có lỗi khi upload ảnh:", error);
    }
  };

  const handleSave = () => {
    if (!date || !category || !amount) {
      showErrorToast("Vui lòng nhập đầy đủ");
      return;
    }

    if (uploadError) {
      showErrorToast("Vui lòng tải lên tệp ảnh hợp lệ");
      return;
    }
    const newTransaction = {
      transactionBody: {
        createAt: date,
        transactionCategory: category,
        transactionDescription: description,
        transactionAmount: amount,
        receipt,
        transactionType: isExpense ? "expense" : "income",
      },
    };

    if (transactionData) {
      dispatch(updateTransaction(newTransaction));
      showSuccessToast("Cập nhật thành công");
    } else {
      dispatch(addTransactions(newTransaction));
      showSuccessToast("Thêm thành công");
    }

    dispatch(toggleModal(false));
    dispatch(resetTransactionData());
  };

  const handleDelete = () => {
    if (transactionData) {
      dispatch(removeTransaction(transactionData.id));
      showSuccessToast("Xóa thành công");
      dispatch(toggleModal(false));
      dispatch(resetTransactionData());
    }
  };

  return (
    <Modal
      title={title || "Transaction"}
      open={isShow}
      onCancel={() => {
        dispatch(toggleModal(false));
        dispatch(resetTransactionData());
      }}
      width="80%"
      footer={null}
    >
      <div className="px-4 py-6 space-y-4 text-[14px] font-bold xl:w-[70vw] md:mx-auto">
        <div className="flex border rounded-[15px] h-[32px] md:h-[60px] md:rounded-full bg-[#D9D9D9]">
          <button
            className={`flex-1 h-full rounded-l-full md:h-[60px] md:text-2xl ${
              isExpense
                ? "bg-[#EF8767] text-white"
                : "bg-transparent text-black"
            }`}
            onClick={() => setIsExpense(true)}
          >
            Expense
          </button>
          <button
            className={`flex-1 h-full rounded-r-[15px] md:h-[60px] md:rounded-r-full md:text-2xl ${
              !isExpense
                ? "bg-[#EF8767] text-white"
                : "bg-transparent text-black"
            }`}
            onClick={() => setIsExpense(false)}
          >
            Income
          </button>
        </div>
        <div>
          <input
            type="date"
            className="w-full rounded-[15px] h-[32px] md:h-[60px] md:rounded-full md:text-2xl md:ps-5 bg-[#D9D9D9] font-bold text-[14px] px-3"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <select
          className="w-full rounded-[15px] h-[32px] md:h-[60px] md:rounded-full md:text-2xl md:ps-5 bg-[#D9D9D9] font-bold text-[14px] px-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {transactionCategory.map((item) => (
            <option key={item.type} value={item.type}>
              {item.type}
            </option>
          ))}
        </select>
        <div>
          <input
            type="text"
            className="w-full rounded-[15px] h-[32px] md:h-[60px] md:rounded-full md:text-2xl md:ps-5 bg-[#D9D9D9] font-bold text-[14px] px-3"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <input
            className="w-full rounded-[15px] h-[32px] md:h-[60px] md:rounded-full md:text-2xl md:ps-5 bg-[#D9D9D9] font-bold text-[14px] px-3"
            placeholder="Amount"
            value={amount}
            onChange={handleAmountChange}
          />
        </div>
        <div>
          <label className="text-sm font-semibold md-text-xl">
            {isExpense ? "Expense upload receipt" : "Income upload receipt"}
          </label>
          <Upload
            beforeUpload={(file) => {
              handleFileUpload(file);
              return false;
            }}
          >
            <Button className="ms-4">Upload Receipt</Button>
          </Upload>
        </div>
        <div className="flex justify-between mt-4">
          {transactionData ? (
            <Button
              onClick={handleDelete}
              className="w-[48%] h-[32px] bg-[#CFBBD4] rounded-[15px] md:h-[60px] md:rounded-full md:text-2xl font-bold text-[14px] text-white"
            >
              Delete
            </Button>
          ) : (
            <Button
              onClick={() => {
                dispatch(toggleModal(false));
                dispatch(resetTransactionData());
              }}
              className="w-[48%] h-[32px] bg-[#CFBBD4] rounded-[15px] md:h-[60px] md:rounded-full md:text-2xl font-bold text-[14px] text-black"
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSave}
            className="w-[48%] h-[32px] bg-[#EF8767] rounded-[15px] md:h-[60px] md:rounded-full md:text-2xl font-bold text-[14px] text-white"
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalExpense;
