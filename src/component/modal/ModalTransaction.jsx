import { useEffect, useState } from "react";
import { Modal, Button, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  addTransaction,
  updateTransaction,
  removeTransaction,
} from "../../redux-toolkit/transactionSlice.jsx";
import { showSuccessToast, showErrorToast } from "../../untils/Toaste.jsx";
import { v4 as uuidv4 } from "uuid";
import { transactionTypes } from "../TransactionItem.jsx";
import {
  toggleModal,
  resetTransactionData,
} from "../../redux-toolkit/modalSlice.jsx";

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

  useEffect(() => {
    if (transactionData) {
      setDate(transactionData.date || "");
      setCategory(transactionData.category || "Shopping");
      setDescription(transactionData.description || "");
      setAmount(Math.abs(transactionData.amount) || "");
      setIsExpense(transactionData.amount < 0);
      setReceipt(transactionData.receipt || null);
    } else {
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
    }
  }, [transactionData]);

  const handleSave = () => {
    if (!date || !category || !amount) {
      showErrorToast("Vui lòng nhập đầy đủ");
      return;
    }

    const newTransaction = {
      id: transactionData ? transactionData.id : uuidv4(),
      date,
      category,
      description,
      amount: isExpense ? -amount : +amount,
      receipt,
      transactionType: isExpense ? "expense" : "income",
    };

    if (transactionData) {
      dispatch(updateTransaction(newTransaction));
      showSuccessToast("Cập nhật thành công");
    } else {
      dispatch(addTransaction(newTransaction));
      showSuccessToast("Thêm thành công");
    }

    dispatch(toggleModal(false)); // Đóng modal
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
          {transactionTypes.map((item) => (
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
            type="number"
            className="w-full rounded-[15px] h-[32px] md:h-[60px] md:rounded-full md:text-2xl md:ps-5 bg-[#D9D9D9] font-bold text-[14px] px-3"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold md-text-xl">
            Expense Receipt Image
          </label>
          <Upload
            beforeUpload={(file) => {
              const fileUrl = URL.createObjectURL(file);
              setReceipt(fileUrl);
              return false;
            }}
          >
            <Button>Upload Receipt</Button>
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
