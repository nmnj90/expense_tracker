import { useState } from 'react';

const ICONS = {
  food: (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <path d='M7 3v8a2 2 0 0 0 2 2h0V3' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
      <path d='M11 3v18' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
      <path d='M16 3c2.2 0 3 2.2 3 5v5h-3V3Z' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' />
      <path d='M16 13v8' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
    </svg>
  ),
  house: (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <path d='M4 11.5 12 4l8 7.5' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M6.5 10.5V20h11v-9.5' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' />
    </svg>
  ),
  transport: (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <path d='M4 15V9.5A4.5 4.5 0 0 1 8.5 5h7A4.5 4.5 0 0 1 20 9.5V15' fill='none' stroke='currentColor' strokeWidth='1.8' />
      <path d='M3 15h18v2.5a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 17.5V15Z' fill='none' stroke='currentColor' strokeWidth='1.8' />
      <circle cx='7.5' cy='18.5' r='1.2' fill='currentColor' />
      <circle cx='16.5' cy='18.5' r='1.2' fill='currentColor' />
    </svg>
  ),
  entertainment: (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <rect x='3.5' y='7' width='17' height='11' rx='2.5' fill='none' stroke='currentColor' strokeWidth='1.8' />
      <path d='M8 7V5.8A1.8 1.8 0 0 1 9.8 4h4.4A1.8 1.8 0 0 1 16 5.8V7' fill='none' stroke='currentColor' strokeWidth='1.8' />
      <circle cx='9' cy='12.5' r='1' fill='currentColor' />
      <circle cx='15' cy='12.5' r='1' fill='currentColor' />
    </svg>
  ),
  health: (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <path d='M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' />
    </svg>
  ),
  education: (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <path d='M3 9.5 12 5l9 4.5-9 4.5L3 9.5Z' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' />
      <path d='M7 12v4.2c0 .8 2.2 2.3 5 2.3s5-1.5 5-2.3V12' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' />
      <path d='M21 10v6' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
    </svg>
  ),
  salary: (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <rect x='3.5' y='6.5' width='17' height='11' rx='2' fill='none' stroke='currentColor' strokeWidth='1.8' />
      <circle cx='12' cy='12' r='2.3' fill='none' stroke='currentColor' strokeWidth='1.8' />
      <path d='M3.5 9.5h17' fill='none' stroke='currentColor' strokeWidth='1.8' />
    </svg>
  ),
  freelance: (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <path d='M8 8V6.8A1.8 1.8 0 0 1 9.8 5h4.4A1.8 1.8 0 0 1 16 6.8V8' fill='none' stroke='currentColor' strokeWidth='1.8' />
      <rect x='4.5' y='8' width='15' height='11' rx='2' fill='none' stroke='currentColor' strokeWidth='1.8' />
      <path d='M4.5 12h15' fill='none' stroke='currentColor' strokeWidth='1.8' />
    </svg>
  ),
  investment: (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <path d='M4 17 9.5 11.5 13 15l7-8' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M14 7h6v6' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  ),
  gift: (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <rect x='4' y='10' width='16' height='10' rx='1.5' fill='none' stroke='currentColor' strokeWidth='1.8' />
      <path d='M12 10v10M4 14h16' fill='none' stroke='currentColor' strokeWidth='1.8' />
      <path d='M12 10c-2.2 0-4-1.2-4-2.7S10.2 5 12 7c1.8-2 4-1.8 4 .3S14.2 10 12 10Z' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' />
    </svg>
  ),
  other: (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <circle cx='6.5' cy='12' r='1.4' fill='currentColor' />
      <circle cx='12' cy='12' r='1.4' fill='currentColor' />
      <circle cx='17.5' cy='12' r='1.4' fill='currentColor' />
    </svg>
  ),
};

const COST_OPTIONS = [
  { value: 'food', label: 'Food', icon: ICONS.food },
  { value: 'house', label: 'House', icon: ICONS.house },
  { value: 'transport', label: 'Transport', icon: ICONS.transport },
  { value: 'entertainment', label: 'Entertainment', icon: ICONS.entertainment },
  { value: 'health', label: 'Health', icon: ICONS.health },
  { value: 'education', label: 'Education', icon: ICONS.education },
  { value: 'other', label: 'Other', icon: ICONS.other },
];

const INCOME_OPTIONS = [
  { value: 'salary', label: 'Salary', icon: ICONS.salary },
  { value: 'freelance', label: 'Freelance', icon: ICONS.freelance },
  { value: 'investment', label: 'Investment', icon: ICONS.investment },
  { value: 'gift', label: 'Gift', icon: ICONS.gift },
  { value: 'other', label: 'Other', icon: ICONS.other },
];

export { ICONS, COST_OPTIONS, INCOME_OPTIONS };

export default function Select({
  label,
  id,
  name,
  ref,
  defaultValue,
  error,
  transactionType,
}) {
  const options =
    transactionType === 'income' ? INCOME_OPTIONS : COST_OPTIONS;
  const initialValue = options.some((option) => option.value === defaultValue)
    ? defaultValue
    : options[0].value;
  const [selected, setSelected] = useState(initialValue);

  return (
    <div className='form-field-wrapper'>
      <span className='form-label' id={`${id}-label`}>{label}</span>
      <input
        type='hidden'
        id={id}
        name={name}
        ref={ref}
        value={selected}
        readOnly
      />
      <div
        className='category-grid'
        role='radiogroup'
        aria-labelledby={`${id}-label`}
      >
        {options.map((option) => {
          const isSelected = selected === option.value;

          return (
            <button
              key={option.value}
              type='button'
              role='radio'
              aria-checked={isSelected}
              className={`category-option${isSelected ? ' is-selected' : ''}`}
              onClick={() => setSelected(option.value)}
            >
              <span className='category-option__icon'>{option.icon}</span>
              <span className='category-option__label'>{option.label}</span>
            </button>
          );
        })}
      </div>
      {error ? <p className='form-error'>{error}</p> : null}
    </div>
  );
}
