import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { Modal, Upload, Button } from "antd";

import { addCate, updateCate } from "../../feature/transactionSlice";
import { showErrorToast } from "../../utils/Toaste";

function ModalCategory({ isShowModalCate, hide, categoryData }) {
  const BASE_PATH = import.meta.env.VITE_BASE_PATH;
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryImageDisplay, setCategoryImageDisplay] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(categoryData);
    if (categoryData) {
      setCategoryName(categoryData.name);
      setCategoryImage(categoryData.image);
      setCategoryImageDisplay(`${BASE_PATH}${categoryData.image} `);
    }
  }, [categoryData]);
  const handleFileUpload = async (file) => {
    if (!file.type.startsWith("image/")) {
      return;
    }
    setCategoryImage(file);
    setCategoryImageDisplay(URL.createObjectURL(file));
  };
  const handleSave = async () => {
    if (!categoryName) {
      showErrorToast("Enter category name");
      return;
    }
    const newCategory = {
      name: categoryName,
      image: categoryImage,
    };
    const updateCategory = {
      id: categoryData?.id,
      name: categoryName,
      image: categoryImage,
    };
    try {
      if (categoryData) {
        dispatch(updateCate(updateCategory));
      } else {
        await dispatch(addCate(newCategory));
        setCategoryName("");
        setCategoryImage(null);
      }
    } catch (error) {
      showErrorToast(error.message);
    }
  };
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
          </div>
          <div className="mt-4 relative w-[128px] mb-5">
            {categoryImage && (
              <img
                src={categoryImageDisplay}
                alt="receipt"
                className="w-32 h-32 object-cover rounded-md"
              />
            )}
          </div>
        </div>
        <div className="text-center">
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
}

export default ModalCategory;
