export const formatCurrency = (amount) => {
  return amount.toLocaleString("vi-VN", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
