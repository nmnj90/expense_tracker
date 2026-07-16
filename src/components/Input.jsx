export default function Input({ label, type, id, name, ref }) {
  let input = null;
  if (name === 'typeOfExpense') {
    input = <select className='form-input' id={id} name={name} ref={ref}>
        <option value='food'>Cost</option>
        <option value='house'>House</option>
        <option value='transport'>Transport</option>
        <option value='entertainment'>Entertainment</option>
        <option value='health'>Health</option>
        <option value='education'>Education</option>
        <option value='other'>Other</option>
    </select>
  } else {
   input = <input className='form-input' id={id} name={name} type={type} ref={ref} />
  }
  return (
    <div className='form-field-wrapper'>
      <label className='form-label' htmlFor={id}>{label}</label>
      {input}
    </div>
  )
}
