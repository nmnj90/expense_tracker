export default function Input({
  label,
  type,
  id,
  name,
  ref,
  defaultValue,
  error,
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
      />
      {error ? <p className='form-error'>{error}</p> : null}
    </div>
  );
}
