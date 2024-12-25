import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Modal, Button, Upload } from "antd";
import { CloseOutlined } from "@ant-design/icons";

import { showErrorToast } from "../../utils/Toaste.js";
import { toggleModal, resetTransactionData } from "../../feature/modalSlice.js";
import { transactionCategory } from "../constants/constant.js";
import {
  removeTransactions,
  addTransactions,
  updateTransactions,
  addReceiptImage,
} from "../../feature/transactionSlice.js";
import {
  updateReceipt,
  removeReceipt,
} from "../../services/receiptServices.js";
import ModalCategory from "./ModalCategory.jsx";

const ModalExpense = () => {
  const dispatch = useDispatch();
  const { isShow, title, transactionData } = useSelector(
    (state) => state.modal,
  );

  const BASE_PATH = import.meta.env.VITE_BASE_PATH;

  const [id, setId] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Shopping");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [isExpense, setIsExpense] = useState(true);
  const [receiptImage, setReceiptImage] = useState("");
  const [isUpdateReceipt, setIsUpdateReceipt] = useState(false);

  useEffect(() => {
    if (transactionData) {
      setId(transactionData.id || "");
      setDate(transactionData.createAt || "");
      setCategory(transactionData.transactionCategory || "Shopping");
      setDescription(transactionData.transactionDescription || "");
      setAmount(transactionData.transactionAmount || "");
      setIsExpense(transactionData.transactionType === "income" ? false : true);
      setReceipt(transactionData.receipt || null);
      setReceiptImage(`${BASE_PATH}${transactionData.receipt} `);
    } else {
      const today = new Date().toISOString().split("T")[0];
      console.log(today);
      setDate(today);
    }
  }, [transactionData]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]+$/.test(value)) {
      setAmount(value);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith("image/")) {
      return;
    }
    setIsUpdateReceipt(true);
    setReceipt(file);
    setReceiptImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!date || !category || !amount) {
      showErrorToast("Vui lòng nhập đầy đủ");
      return;
    }

    const newTransaction = {
      transactionBody: {
        createAt: date,
        transactionCategory: category,
        transactionDescription: description,
        transactionAmount: amount,
        transactionType: isExpense ? "expense" : "income",
        // receipt:receipt,
      },
    };
    const updateTrans = {
      id: id,
      createAt: date,
      transactionCategory: category,
      transactionDescription: description,
      transactionAmount: amount,
      transactionType: isExpense ? "expense" : "income",
    };

    try {
      if (transactionData) {
        if (receipt && isUpdateReceipt) {
          await updateReceipt({ id: id, receipt });
        }
        dispatch(updateTransactions(updateTrans));
      } else {
        const response = await dispatch(addTransactions(newTransaction));
        dispatch(
          addReceiptImage({ data: receipt, id: response.payload.data.id }),
        );
      }
      dispatch(toggleModal(false));
      dispatch(resetTransactionData());
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleDelete = () => {
    if (transactionData) {
      dispatch(removeTransactions(transactionData.id));
      dispatch(toggleModal(false));
      dispatch(resetTransactionData());
    }
  };


  const handleDeleteImage = async () => {
    try {
      if (transactionData && transactionData.receipt) {
        await removeReceipt(transactionData.id);
        setReceipt(null);
      }
    } catch (error) {
      showErrorToast(error.message || "Error deleting receipt.");
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCateOpen,setIsModalCateOpen]=useState(false)

  const showModalCate = () => {
    setIsModalCateOpen(true)
  }
  const showModalCateAdd = () => {
    setIsModalCateOpen(true)
    setCategory("")
  }
  const hideModalCate =() => {
    setIsModalCateOpen(false)
  }

  const showImage = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
          <div className="mb-3 flex items-center justify-between">
            <label className=" text-sm md:text-[20px]">Category</label>
            <div>
              <Button onClick={showModalCate} className="w-[60px] md:w-[120px] h-[20px] bg-[#CFBBD4] rounded-[15px] md:h-[40px] md:rounded-full md:text-[18px] font-bold text-[14px] text-black">
                Edit
              </Button>
              <Button onClick={showModalCateAdd} className="w-[60px] md:w-[120px] h-[20px] bg-[#EF8767] rounded-[15px] md:h-[40px] md:rounded-full md:text-[18px] font-bold text-[14px] text-white ms-3">
                Add
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 ">
            {transactionCategory.map((item) => (
              <div
                className={`flex relative cursor-pointer flex-col  h-[70px] md:h-[90px] rounded-lg ${category==item.type ? "border-4 border-[#CFBBD4]" :"border border-[#CFBBD4]"}  items-center py-2 `}
                key={item.type}
                onClick={()=>{
                  setCategory(item.type)
                }}
              >
                {category== item.type && (
                <span
                  onClick={handleDeleteImage}
                  className="absolute top-[-10px] right-[-10px] flex items-center justify-center text-black  w-[28px] h-[28px] rounded-full bg-[#EF8767] cursor-pointer"
                >
                  <CloseOutlined />
                </span>

                )}
                <img
                  className="w-8 h-8 rounded-full text-black  md:w-12 md:h-12"
                  src=""
                  alt=""
                />
                <p>{item.type}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold md:text-[20px] ">
            {isExpense ? "Expense upload receipt" : "Income upload receipt"}
          </label>
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              if (!file.type.startsWith("image/")) {
                showErrorToast("Chỉ cho phép upload tệp ảnh");
                return false;
              }
              handleFileUpload(file);
              return false;
            }}
          >
            <Button className="ms-4">Upload Receipt</Button>
          </Upload>
          {receipt && (
            <div className="mt-4 relative w-[128px]">
              <img
                src={receiptImage}
                alt="receipt"
                className="w-32 h-32 object-cover rounded-md"
                onClick={showImage}
              />
              <span
                onClick={handleDeleteImage}
                className="absolute top-[-10px] right-[-16px] flex items-center justify-center text-black  w-[32px] h-[32px] rounded-full bg-[#EF8767] cursor-pointer"
              >
                <CloseOutlined />
              </span>
            </div>
          )}
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
      <ModalCategory
            isShowModalCate={isModalCateOpen}
            hide={hideModalCate}
            categoryData={category}
          />
      <Modal
        visible={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        width="600px"
        height="600px"
        className=""
      >
        <img src={receiptImage} alt="Receipt" className="" />
      </Modal>
    </Modal>
  );
};

export default ModalExpense;
