import { useRef, useContext } from 'react';
import Input from './Input';
import ExpenseContext from '../context/expenseContext';

export default function Form({ type, onClose, id }) {
  const titleRef = useRef();
  const amountRef = useRef();
  const dateRef = useRef();
  const typeOfExpenseRef = useRef();
  const expenseContext = useContext(ExpenseContext);

  const expenseToUpdate =
    type === 'update'
      ? expenseContext.expenses.find((expense) => expense.id === id)
      : null;

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
      <Input
        ref={titleRef}
        label='Title'
        type='text'
        id={`${type}-title`}
        name='title'
        defaultValue={expenseToUpdate?.title}
      />
      <Input
        ref={amountRef}
        label='Amount'
        type='number'
        id={`${type}-amount`}
        name='amount'
        defaultValue={expenseToUpdate?.amount}
      />
      <Input
        ref={dateRef}
        label='Date'
        type='date'
        id={`${type}-date`}
        name='date'
        defaultValue={expenseToUpdate?.date}
      />
      <Input
        ref={typeOfExpenseRef}
        label='Type of Expense'
        type='select'
        id={`${type}-typeOfExpense`}
        name='typeOfExpense'
        defaultValue={expenseToUpdate?.typeOfExpense}
      />
      <button type='submit'>Submit</button>
    </form>
  );
}
