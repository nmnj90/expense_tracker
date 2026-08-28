import { useEffect, useState } from 'react';
import ExpenseContext from './expenseContext';
import { loadExpenses, saveExpenses } from '../utils/storage';

export default function ExpenseProvider({ accountId, children }) {
  const [expensesList, setExpensesList] = useState(() => loadExpenses(accountId));

  useEffect(() => {
    saveExpenses(accountId, expensesList);
  }, [accountId, expensesList]);

  function addExpenseHandler(expense) {
    setExpensesList((prevExpenses) => [...prevExpenses, expense]);
  }

  function removeExpenseHandler(id) {
    setExpensesList((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id),
    );
  }

  function updateExpenseHandler(id, updatedExpense) {
    setExpensesList((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === id ? { ...expense, ...updatedExpense } : expense,
      ),
    );
  }

  const totalsByCurrency = expensesList.reduce((totals, expense) => {
    const currency = expense.currency || 'RSD';
    const amount = Number(expense.amount) || 0;
    const signedAmount = expense.type?.type === 'cost' ? -amount : amount;

    totals[currency] = (totals[currency] || 0) + signedAmount;
    return totals;
  }, {});

  const expenseContext = {
    totalAmount: totalsByCurrency,
    expenses: expensesList,
    addExpense: addExpenseHandler,
    removeExpense: removeExpenseHandler,
    updateExpense: updateExpenseHandler,
  };

  return (
    <ExpenseContext.Provider value={expenseContext}>
      {children}
    </ExpenseContext.Provider>
  );
}
