import { useRef, useContext } from 'react';
import Input from './Input';
import ExpenseContext from '../context/expenseContext';

export default function Form({ type, onClose, id }) {
  const titleRef = useRef();
  const amountRef = useRef();
  const dateRef = useRef();
  const typeOfExpenseRef = useRef();
  const expenseContext = useContext(ExpenseContext);

  function onSubmitHandler(e) {
    e.preventDefault();
    if (type === 'update') {
      expenseContext.updateExpense(id, {
        title: titleRef.current.value,
        amount: Number(amountRef.current.value),
        date: dateRef.current.value,
        typeOfExpense: typeOfExpenseRef.current.value,
      });
    } else {
      expenseContext.addExpense({
        id: Math.random().toString(),
        title: titleRef.current.value,
        amount: Number(amountRef.current.value),
        date: dateRef.current.value,
        typeOfExpense: typeOfExpenseRef.current.value,
        type: { type },
      });
    }
    onClose?.();
  }

  return (
    <form className='form' onSubmit={onSubmitHandler}>
      <Input ref={titleRef} label='Title' type='text' id='title' name='title' />
      <Input ref={amountRef} label='Amount' type='number' id='amount' name='amount' />
      <Input ref={dateRef} label='Date' type='date' id='date' name='date' />
      <Input ref={typeOfExpenseRef} label='Type of Expense' type='select' id='typeOfExpense' name='typeOfExpense' />
      <button type='submit'>Submit</button>
    </form>
  );
}
