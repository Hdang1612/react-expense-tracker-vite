import { Modal, Upload, Button } from "antd";
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { CloseOutlined } from "@ant-design/icons";
function ModalCategory({ isShowModalCate, hide, categoryData }) {
  // const x =useSelector((state)=>state.modal.transactionData.transactionCategory)
  const [categoryName, setCategoryName] = useState(
    categoryData != "" ? categoryData : "",
  );
  const [categoryImage,setCategoryImage]=useState("")
  useEffect(() => {
    setCategoryName(categoryData|| "");
  }, [categoryData]);
//   const newCategory = {
//     name: categoryName,
//     image: categoryImage,
//   }

//   const updateCategory = {
//     name: categoryName,
//     image: categoryImage
//   }
  return (
    <Modal
      title={"Category"}
      open={isShowModalCate}
      onCancel={hide}
      width="60%"
      footer={null}
    >
      <div className="py-5">
        <input
          type="text"
          className="w-full rounded-[15px] h-[32px] md:h-[60px] md:rounded-full md:text-2xl md:ps-5 bg-[#D9D9D9] font-bold text-[14px] px-3 mb-3"
          value={categoryName}
          placeholder="Category Name"
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <div className="ps-2 flex flex-col items-center">
          <div className="mb-4">
            <label className="text-sm font-semibold md:text-[20px] ">
              Category Image
            </label>
            <Upload
              showUploadList={false}
              // beforeUpload={(file) => {
              //   if (!file.type.startsWith("image/")) {
              //     showErrorToast("Chỉ cho phép upload tệp ảnh");
              //     return false;
              //   }
              //   handleFileUpload(file);
              //   return false;
              // }}
            >
              <Button className="ms-4">Upload Receipt</Button>
            </Upload>
          </div>
          <div className="mt-4 relative w-[128px] ">
            <img
              src=""
              alt="receipt"
              className="w-32 h-32 object-cover rounded-md"
            />
            <span className="absolute top-[-10px] right-[-16px] flex items-center justify-center text-black  w-[32px] h-[32px] rounded-full bg-[#EF8767] cursor-pointer">
              <CloseOutlined />
            </span>
          </div>
        </div>
        <div className="text-center">
          <Button className="w-[48%] h-[32px] bg-[#EF8767] rounded-[15px] md:h-[60px] md:rounded-full md:text-2xl font-bold text-[14px] text-white">
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ModalCategory;
