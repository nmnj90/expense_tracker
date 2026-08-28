export default function Input({
  label,
  type,
  id,
  name,
  ref,
  defaultValue,
  error,
  autoComplete,
}) {
  return (
    <div className='form-field-wrapper'>
      <label className='form-label' htmlFor={id}>{label}</label>
      <input
        className='form-input'
        id={id}
        name={name}
        type={type}
        ref={ref}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
      />
      {error ? <p className='form-error'>{error}</p> : null}
    </div>
  );
}
