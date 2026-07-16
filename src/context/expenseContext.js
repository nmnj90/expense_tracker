import { createContext } from 'react';

const ExpenseContext = createContext({
  totalAmount: 0,
  expenses: [],
  addExpense: (expense) => {},
  removeExpense: (id) => {},
  updateExpense: (id, expense) => {},
});

export default ExpenseContext;