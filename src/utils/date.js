export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return "Today";
  }
  const options = { day: "2-digit", month: "short" }; // "11 Nov"
  return date.toLocaleDateString("en-US", options);
};

export const sortTransactionsByDate = (transactions) => {
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};
