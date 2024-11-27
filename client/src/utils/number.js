export const formatCurrency = (amount) => {
  return Number(amount).toLocaleString("vi-VN", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
