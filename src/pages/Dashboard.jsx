import { useContext, useRef, useState } from 'react';
import Form from '../components/Form';
import ExpenseContext from '../context/expenseContext';
import Modal from '../components/Modal';

export default function Dashboard() {
  const expenseContext = useContext(ExpenseContext);
  const costModalRef = useRef();
  const incomeModalRef = useRef();
  const updateModalRef = useRef();
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  function updateExpenseHandler(id) {
    setSelectedExpenseId(id);
    updateModalRef.current.showModal();
  }

  return (
    <div>
      <h1>Total Amount: {expenseContext.totalAmount}</h1>
      <button onClick={() => costModalRef.current.showModal()}>Add Cost Modal</button>
      <button onClick={() => incomeModalRef.current.showModal()}>Add Income Modal</button>
      {expenseContext.expenses.map((expense) => (
        <div key={expense.id}>
          <h2>{expense.title}</h2>
          <p>{expense.amount}</p>
          <p>{expense.date}</p>
          <button onClick={() => expenseContext.removeExpense(expense.id)}>Remove</button>
          <button onClick={() => updateExpenseHandler(expense.id)}>Update</button>
        </div>
      ))}
      <Modal type='cost' ref={costModalRef}>
        <Form type='cost' onClose={() => costModalRef.current.close()} />
      </Modal>
      <Modal type='income' ref={incomeModalRef}>
        <Form type='income' onClose={() => incomeModalRef.current.close()} />
      </Modal>
      <Modal type='update' ref={updateModalRef}>
        <Form
          key={selectedExpenseId}
          type='update'
          id={selectedExpenseId}
          onClose={() => updateModalRef.current.close()}
        />
      </Modal>
    </div>
  );
}
