import { useRef, useContext, useState } from 'react';
import Input from './Input';
import Select from './Select';
import CurrencySelect from './CurrencySelect';
import ExpenseContext from '../context/expenseContext';

export default function Form({ type, onClose, id }) {
  const titleRef = useRef();
  const amountRef = useRef();
  const currencyRef = useRef();
  const dateRef = useRef();
  const typeOfExpenseRef = useRef();
  const expenseContext = useContext(ExpenseContext);
  const [errors, setErrors] = useState({});

  const expenseToUpdate =
    type === 'update'
      ? expenseContext.expenses.find((expense) => expense.id === id)
      : null;

  const transactionType =
    type === 'update'
      ? expenseToUpdate?.type?.type || 'cost'
      : type;

  function onSubmitHandler(e) {
    e.preventDefault();
    const title = titleRef.current.value.trim();
    const amount = Number(amountRef.current.value);
    const currency = currencyRef.current.value;
    const date = dateRef.current.value;
    const typeOfExpense = typeOfExpenseRef.current.value;
    const nextErrors = {};

    if (!title) {
      nextErrors.title = 'Title is required.';
    }
    if (!amountRef.current.value || Number.isNaN(amount) || amount <= 0) {
      nextErrors.amount = 'Amount must be greater than 0.';
    }
    if (!date) {
      nextErrors.date = 'Date is required.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    if (type === 'update') {
      expenseContext.updateExpense(id, {
        title,
        amount,
        currency,
        date,
        typeOfExpense,
      });
    } else {
      expenseContext.addExpense({
        id: Math.random().toString(),
        title,
        amount,
        currency,
        date,
        typeOfExpense,
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
        error={errors.title}
      />
      <div className='form-row'>
        <Input
          ref={amountRef}
          label='Amount'
          type='number'
          id={`${type}-amount`}
          name='amount'
          defaultValue={expenseToUpdate?.amount}
          error={errors.amount}
        />
        <CurrencySelect
          ref={currencyRef}
          id={`${type}-currency`}
          defaultValue={expenseToUpdate?.currency || 'RSD'}
        />
      </div>
      <Input
        ref={dateRef}
        label='Date'
        type='date'
        id={`${type}-date`}
        name='date'
        defaultValue={expenseToUpdate?.date}
        error={errors.date}
      />
      <Select
        ref={typeOfExpenseRef}
        label={transactionType === 'income' ? 'Type of Income' : 'Type of Expense'}
        id={`${type}-typeOfExpense`}
        name='typeOfExpense'
        transactionType={transactionType}
        defaultValue={expenseToUpdate?.typeOfExpense}
      />
      <button type='submit'>Submit</button>
    </form>
  );
}
