// GeneralReport.js
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieStatisticGeneral = () => {
  const { totalIncome, totalExpense } = useSelector(
    (state) => state.transactions,
  );
  const [chartData, setChartData] = useState({});
  const [options, setOptions] = useState({});

  useEffect(() => {
    setChartData({
      labels: ["Income", "Expense"],
      datasets: [
        {
          label: "Income vs Expense",
          data: [totalIncome, totalExpense],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
          ],
          borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    });

    setOptions({
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    });
  }, [totalIncome, totalExpense]);

  return (
    <div>
      {chartData.labels && chartData.datasets ? (
        <Pie data={chartData} options={options} />
      ) : (
        <p>Loading expense data...</p>
      )}
    </div>
  );
};

const calculateMonthlyTotals = (transactions) => {
  const totals = Array(12)
    .fill(null)
    .map(() => ({ income: 0, expense: 0 }));
  transactions.forEach((transaction) => {
    const date = new Date(transaction.createAt);
    const monthIndex = date.getMonth();

    if (transaction.transactionType === "income") {
      totals[monthIndex].income += Number(transaction.transactionAmount);
    } else if (transaction.transactionType === "expense") {
      totals[monthIndex].expense += Number(transaction.transactionAmount);
    }
  });

  return totals.map((totals, index) => ({
    month: new Date(2024, index).toLocaleString("en-US", { month: "short" }),
    income: totals.income,
    expense: totals.expense,
  }));
};
export const PieStatisticMonth = ({ month }) => {
  const transactions = useSelector(
    (state) => state.transactions.transactions || [],
  );

  const [pieData, setPieData] = useState({});

  useEffect(() => {
    const monthlyTotals = calculateMonthlyTotals(transactions);
    const selectedMonth = monthlyTotals.find(
      (item) => item.month === month,
    ) || {
      income: 0,
      expense: 0,
    };

    const data = {
      labels: ["Income", "Expense"],
      datasets: [
        {
          data: [selectedMonth.income, selectedMonth.expense],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
          ],
          borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    };

    setPieData(data);
  }, [transactions, month]);

  return (
    <div style={{ width: "300px", height: "300px" }}>
      {pieData.labels ? (
        <Pie data={pieData} options={{ responsive: true }} />
      ) : (
        <p>Loading pie chart data...</p>
      )}
    </div>
  );
};
