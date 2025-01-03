import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Empty } from "antd";

import ExpenseItem from "./transaction_item/TransactionItem";
import { setTransactionData, toggleModal } from "../feature/modalSlice";
import {
  selectTodayTransactions,
  selectMonthlyTransactions,
  selectWeeklyTransactions,
} from "../feature/transactionSlice";

export const TransactionListPagination = ({ transactions, categories }) => {
  const [openItemId, setOpenItemId] = useState(null);
  const dispatch = useDispatch();
  const handleItemClick = (transaction) => {
    dispatch(setTransactionData(transaction));
    dispatch(toggleModal(true));
  };
  return (
    <div>
      {transactions.length > 0 ? (
        transactions.map((transaction) => {
          const categoryName = categories.find(
            (cat) => cat.id === transaction.transactionCategory,
          )?.name;
          return (
            <ExpenseItem
              key={transaction.id}
              transaction={transaction}
              updateAction={() => handleItemClick(transaction)}
              categoryName={categoryName}
              openItemId={openItemId}
              setOpenItemId={setOpenItemId}
            />
          );
        })
      ) : (
        <Empty className="mt-[80px]" description="No transaction " />
      )}
    </div>
  );
};
export const TransactionList = ({ transactions, categories }) => {
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
                {group.transactions.map((transaction) => {
                  const categoryName = categories.find(
                    (cat) => cat.id === transaction.transactionCategory,
                  )?.name;

                  return (
                    <ExpenseItem
                      key={transaction.id}
                      transaction={transaction}
                      categoryName={categoryName}
                      updateAction={() => handleItemClick(transaction)}
                      openItemId={openItemId}
                      setOpenItemId={setOpenItemId}
                    />
                  );
                })}
              </div>
            );
          } else {
            // Nếu là danh sách giao dịch đơn lẻ, render mỗi giao dịch
            const categoryName = categories.find(
              (cat) => cat.id === group.transactionCategory,
            )?.name;
            return (
              <div key={index}>
                <ExpenseItem
                  key={group.id}
                  transaction={group}
                  categoryName={categoryName}
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
  const category = useSelector((state) => state.transactions.categoriesList);
  return <TransactionList transactions={transactions} categories={category} />;
};

export const WeeklyTransactionsList = () => {
  const transactions = useSelector(selectWeeklyTransactions);
  const category = useSelector((state) => state.transactions.categoriesList);
  return <TransactionList transactions={transactions} categories={category} />;
};

export const MonthlyTransactionsList = () => {
  const transactions = useSelector(selectMonthlyTransactions);
  const category = useSelector((state) => state.transactions.categoriesList);
  return <TransactionList transactions={transactions} categories={category} />;
};
