import { useState } from "react";
import { useEffect } from "react";
import { Empty } from "antd";
import { useDispatch } from "react-redux";

import ExpenseItem from "./transaction_item/TransactionItem";
import { setTransactionData, toggleModal } from "../feature/modalSlice";
import { filterByPeriodTime } from "../services/transactionServices";
export const TransactionListPagination = ({ transactions }) => {
  const [openItemId, setOpenItemId] = useState(null);
  const dispatch = useDispatch();
  const handleItemClick = (transaction) => {
    dispatch(setTransactionData(transaction));
    dispatch(toggleModal(true));
  };
  return (
    <div>
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <ExpenseItem
            key={transaction.id}
            transaction={transaction}
            updateAction={() => handleItemClick(transaction)}
            openItemId={openItemId}
            setOpenItemId={setOpenItemId}
          />
        ))
      ) : (
        <Empty className="mt-[80px]" description="No transaction " />
      )}
    </div>
  );
};
export const TransactionList = ({ transactions }) => {
  const dispatch = useDispatch();
  const [openItemId, setOpenItemId] = useState(null);
  const handleItemClick = (transaction) => {
    dispatch(setTransactionData(transaction));
    dispatch(toggleModal(true));
  };

  return (
    <div className="h-[700px] md:h-[600px] ">
      {Array.isArray(transactions) && transactions.length > 0 ? (
        transactions.map((group, index) => {
          if (group.transactions) {
            // Nếu là nhóm giao dịch, render tên nhóm và các giao dịch bên trong
            return (
              <div key={index}>
                <h3>{group.label}</h3>
                {group.transactions.map((transaction) => (
                  <ExpenseItem
                    key={transaction.id}
                    transaction={transaction}
                    updateAction={() => handleItemClick(transaction)}
                    openItemId={openItemId}
                    setOpenItemId={setOpenItemId}
                  />
                ))}
              </div>
            );
          } else {
            // Nếu là danh sách giao dịch đơn lẻ, render mỗi giao dịch
            return (
              <div key={index}>
                <ExpenseItem
                  key={group.id}
                  transaction={group}
                  updateAction={() => handleItemClick(group)}
                  openItemId={openItemId}
                  setOpenItemId={setOpenItemId}
                />
              </div>
            );
          }
        })
      ) : (
        <Empty description="No transaction " />
      )}
    </div>
  );
};

export const TodayTransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const result = await filterByPeriodTime("today");
        setTransactions(result.data);
      } catch (error) {
        console.error("Error fetching today's transactions:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) return <div>Loading</div>;

  return <TransactionList transactions={transactions} />;
};

export const WeeklyTransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const result = await filterByPeriodTime("weekly");
        setTransactions(result.data);
      } catch (error) {
        console.error("Error fetching weekly transactions:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) return <div>Loading</div>;

  return <TransactionList transactions={transactions} />;
};

export const MonthlyTransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const result = await filterByPeriodTime("monthly");
        setTransactions(result.data);
      } catch (error) {
        console.error("Error fetching monthly transactions:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) return <div>Loading</div>;

  return <TransactionList transactions={transactions} />;
};
