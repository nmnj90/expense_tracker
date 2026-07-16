import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ExpenseContext from './context/expenseContext';

function App() {
  const [expensesList, setExpensesList] = useState([]);

  function addExpenseHandler(expense) {
    setExpensesList((prevExpenses) => [...prevExpenses, expense]);
  }

  function removeExpenseHandler(id) {
    setExpensesList((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
  }

  function updateExpenseHandler(id, updatedExpense) {
    setExpensesList((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === id ? { ...expense, ...updatedExpense } : expense,
      ),
    );
  }

  const totalAmount = expensesList.reduce(
    (sum, expense) => expense.type.type === 'cost' ? sum - Number(expense.amount) : sum + Number(expense.amount),
    0,
  );

  const expenseContext = {
    totalAmount,
    expenses: expensesList,
    addExpense: addExpenseHandler,
    removeExpense: removeExpenseHandler,
    updateExpense: updateExpenseHandler
  }

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
