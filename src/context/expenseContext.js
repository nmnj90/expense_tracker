import { createContext } from 'react';

const ExpenseContext = createContext({
  totalAmount: {},
  expenses: [],
  addExpense: (expense) => {},
  removeExpense: (id) => {},
  updateExpense: (id, expense) => {},
});

export default ExpenseContext;