import { useContext, useRef, useState } from 'react';
import Form from '../components/Form';
import Statistics from '../components/Statistics';
import AuthContext from '../context/authContext';
import ExpenseContext from '../context/expenseContext';
import Modal from '../components/Modal';
import { ICONS } from '../components/Select';
import { formatMoney } from '../utils/currency';

export default function Dashboard() {
  const { currentUser, logout } = useContext(AuthContext);
  const expenseContext = useContext(ExpenseContext);
  const costModalRef = useRef();
  const incomeModalRef = useRef();
  const updateModalRef = useRef();
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  const selectedExpense =
    expenseContext.expenses.find((expense) => expense.id === selectedExpenseId) ||
    null;
  const selectedTone = selectedExpense?.type?.type === 'income' ? 'income' : 'cost';

  const totalsByCurrency = expenseContext.totalAmount || {};
  const totalEntries = Object.entries(totalsByCurrency);

  function updateExpenseHandler(id) {
    setSelectedExpenseId(id);
    updateModalRef.current.showModal();
  }

  return (
    <div className='dashboard'>
      <div className='dashboard__account'>
        <p className='dashboard__account-name'>
          {currentUser.name}
          <span>{currentUser.email}</span>
        </p>
        <button className='btn btn--ghost' type='button' onClick={logout}>
          Log out
        </button>
      </div>
      <header className='dashboard__header'>
        <div>
          <h1 className='dashboard__title'>Expense Tracker</h1>
          <div className='dashboard__total'>
            <span>Total Amount:</span>
            {totalEntries.length === 0 ? (
              <strong>{formatMoney(0, 'RSD')}</strong>
            ) : (
              <div className='dashboard__totals'>
                {totalEntries.map(([currency, amount]) => (
                  <strong
                    key={currency}
                    className={
                      amount > 0
                        ? 'is-positive'
                        : amount < 0
                          ? 'is-negative'
                          : undefined
                    }
                  >
                    {formatMoney(amount, currency, { signed: true })}
                  </strong>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className='dashboard__actions'>
          <button className='btn btn--cost' onClick={() => costModalRef.current.showModal()}>
            Add Cost
          </button>
          <button className='btn btn--income' onClick={() => incomeModalRef.current.showModal()}>
            Add Income
          </button>
        </div>
      </header>

      <Statistics expenses={expenseContext.expenses} />

      <h2 className='dashboard__section-title'>Transactions</h2>

      <div className='expense-list'>
        {expenseContext.expenses.length === 0 ? (
          <div className='expense-empty'>
            <h2>No transactions yet</h2>
            <p>Add a cost or income to start tracking this account.</p>
          </div>
        ) : null}
        {expenseContext.expenses.map((expense) => {
          const kind = expense.type?.type === 'income' ? 'income' : 'cost';
          const signedAmount =
            kind === 'cost' ? -Number(expense.amount) : Number(expense.amount);

          return (
            <div className={`expense-item expense-item--${kind}`} key={expense.id}>
              <div>
                <div className='expense-item__heading'>
                  <h2 className='expense-item__title'>{expense.title}</h2>
                  <span className={`expense-item__badge expense-item__badge--${kind}`}>
                    {kind === 'income' ? 'Income' : 'Cost'}
                  </span>
                </div>
                <div className='expense-item__meta'>
                  <p className={`expense-item__amount expense-item__amount--${kind}`}>
                    {formatMoney(signedAmount, expense.currency || 'RSD', {
                      signed: true,
                    })}
                  </p>
                  <p>{expense.date}</p>
                  <p className='expense-item__category'>
                    <span className='expense-item__category-icon'>
                      {ICONS[expense.typeOfExpense] || ICONS.other}
                    </span>
                    {expense.typeOfExpense}
                  </p>
                </div>
              </div>
              <div className='expense-item__actions'>
                <button
                  className='btn btn--ghost'
                  onClick={() => updateExpenseHandler(expense.id)}
                >
                  Update
                </button>
                <button
                  className='btn btn--danger'
                  onClick={() => expenseContext.removeExpense(expense.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal type='cost' ref={costModalRef}>
        <Form type='cost' onClose={() => costModalRef.current.close()} />
      </Modal>
      <Modal type='income' ref={incomeModalRef}>
        <Form type='income' onClose={() => incomeModalRef.current.close()} />
      </Modal>
      <Modal type='update' tone={selectedTone} ref={updateModalRef}>
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
