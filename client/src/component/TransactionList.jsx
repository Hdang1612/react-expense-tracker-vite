import { useState } from "react";
// import { useEffect } from "react";
import { Empty } from "antd";
import { useDispatch, useSelector } from "react-redux";

import ExpenseItem from "./transaction_item/TransactionItem";
import { setTransactionData, toggleModal } from "../feature/modalSlice";
// import { groupTransaction } from "../feature/transactionSlice";

import {
  selectTodayTransactions,
  selectMonthlyTransactions,
  selectWeeklyTransactions,
} from "../feature/transactionSlice";
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
                <h3>{group.name}</h3>
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
  const transactions = useSelector(selectTodayTransactions);
  return <TransactionList transactions={transactions} />;
};

export const WeeklyTransactionsList = () => {
  const transactions = useSelector(selectWeeklyTransactions);

  return <TransactionList transactions={transactions} />;
};

export const MonthlyTransactionsList = () => {
  const transactions = useSelector(selectMonthlyTransactions);

  return <TransactionList transactions={transactions} />;
};

// export const TodayTransactionsList = () => {
//   const [transactions, setTransactions] = useState(useSelector((state) =>state.transactions));
//   // const transactions = useSelector((state) =>state.transactions.todayTransaction)
//   // console.log(transactions)
//   const dispatch=useDispatch()
//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const result = await dispatch(groupTransaction("today")).unwrap();
//         setTransactions(result);
//       } catch (error) {
//         console.error("Failed to fetch transactions:", error);
//       }
//     };

//     fetchTransactions();
//   }, [dispatch]);

//   return <TransactionList transactions={transactions} />;
// };

// export const WeeklyTransactionsList = () => {
//   const [transactions, setTransactions] = useState([]);
//   const dispatch=useDispatch()
//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const result = await dispatch(groupTransaction("weekly")).unwrap();
//         setTransactions(result);
//       } catch (error) {
//         console.error("Failed to fetch transactions:", error);
//       }
//     };

//     fetchTransactions();
//   }, [dispatch]);

//   return <TransactionList transactions={transactions} />;
// };

// export const MonthlyTransactionsList = () => {
//   const [transactions, setTransactions] = useState([]);
//   const dispatch=useDispatch()
//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const result = await dispatch(groupTransaction("monthly")).unwrap();
//         setTransactions(result);
//       } catch (error) {
//         console.error("Failed to fetch transactions:", error);
//       }
//     };

//     fetchTransactions();
//   }, [dispatch]);

//   return <TransactionList transactions={transactions} />;
// };
