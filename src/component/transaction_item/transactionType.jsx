import {
  ShoppingCartOutlined,
  FileTextOutlined,
  DollarCircleOutlined,
  GiftOutlined,
  FileUnknownOutlined,
} from "@ant-design/icons";
export const transactionTypes = [
  { type: "Shopping", icon: <ShoppingCartOutlined /> },
  { type: "Bill", icon: <FileTextOutlined /> },
  { type: "Salary", icon: <DollarCircleOutlined /> },
  { type: "Food", icon: <GiftOutlined /> },
  { type: "Entertainment", icon: <ShoppingCartOutlined /> },
  { type: "Unknown", icon: <FileUnknownOutlined /> },
];
