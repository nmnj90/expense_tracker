export default function Input({
  label,
  type,
  id,
  name,
  ref,
  defaultValue,
  error,
}) {
  let input = null;
  if (name === 'typeOfExpense') {
    input = (
      <select
        className='form-input'
        id={id}
        name={name}
        ref={ref}
        defaultValue={defaultValue}
      >
        <option value='food'>Food</option>
        <option value='house'>House</option>
        <option value='transport'>Transport</option>
        <option value='entertainment'>Entertainment</option>
        <option value='health'>Health</option>
        <option value='education'>Education</option>
        <option value='other'>Other</option>
      </select>
    );
  } else {
    input = (
      <input
        className='form-input'
        id={id}
        name={name}
        type={type}
        ref={ref}
        defaultValue={defaultValue}
      />
    );
  }
  return (
    <div className='form-field-wrapper'>
      <label className='form-label' htmlFor={id}>{label}</label>
      {input}
      {error ? <p className='form-error'>{error}</p> : null}
    </div>
  );
}
