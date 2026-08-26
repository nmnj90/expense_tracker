import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ExpenseContext from './context/expenseContext';

function getInitialExpenses() {
  const savedExpenses = localStorage.getItem('expenses');
  if (!savedExpenses) {
    return [];
  }

  try {
    return JSON.parse(savedExpenses);
  } catch {
    return [];
  }
}

function App() {
  const [expensesList, setExpensesList] = useState(getInitialExpenses);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expensesList));
  }, [expensesList]);

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

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Dashboard />,
    },
  ]);

  return (
    <ExpenseContext.Provider value={expenseContext}>
      <RouterProvider router={router} />
    </ExpenseContext.Provider>
  );
}

export default App;
