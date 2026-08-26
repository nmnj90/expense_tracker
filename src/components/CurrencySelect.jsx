import { CURRENCIES } from '../utils/currency';

export default function CurrencySelect({
  label = 'Currency',
  id,
  name = 'currency',
  ref,
  defaultValue = 'RSD',
  error,
}) {
  return (
    <div className='form-field-wrapper'>
      <label className='form-label' htmlFor={id}>{label}</label>
      <select
        className='form-input'
        id={id}
        name={name}
        ref={ref}
        defaultValue={defaultValue}
      >
        {CURRENCIES.map((currency) => (
          <option key={currency.value} value={currency.value}>
            {currency.label}
          </option>
        ))}
      </select>
      {error ? <p className='form-error'>{error}</p> : null}
    </div>
  );
}
