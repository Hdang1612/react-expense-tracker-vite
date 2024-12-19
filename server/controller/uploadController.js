import multer from "multer";

import {
  uploadReceiptService,
  updateReceiptService,
  deleteReceiptService,
  fetchReceiptService,
} from "../services/uploadServices.js";

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/receipts/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const uploadReceipt = (req, res) => {
  upload.single("receipt")(req, res, async (err) => {
    if (err) return res.status(400).json({ error: "Error uploading file" });

    try {
      const transactionId = req.params.id;
      const receiptPath = await uploadReceiptService(transactionId, req.file);
      res.status(200).json({ receipt: receiptPath });
    } catch (error) {
      console.log(error.message)
      res.status(400).json({ error: error.message });
    }
  });
};

export const updateReceipt = async (req, res) => {
  upload.single("receipt")(req, res, async (err) => {
    if (err) return res.status(400).json({ error: "Error uploading file" });
    try {
      const transactionId = req.params.id;
      const newReceiptPath = await updateReceiptService(
        transactionId,
        req.file,
      );
      res
        .status(200)
        .json({
          message: "Receipt updated successfully",
          receipt: newReceiptPath,
        });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

export const deleteReceipt = async (req, res) => {
  try {
    const transactionId = req.params.id;
    await deleteReceiptService (transactionId)
    res.status(200).json({ message: "Receipt deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const fetchReceipt = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const receipt = await fetchReceiptService(transactionId)
    res.status(200).json({ receipt: receipt });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
