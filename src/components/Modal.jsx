import { createPortal } from 'react-dom';

export default function Modal({ type, children, ref }) {
  return createPortal(
    <dialog className='modal' ref={ref}>
      <h1>{type}</h1>
      {children}
      <form method='dialog'>
        <button type='submit'>Close</button>
      </form>
    </dialog>,
    document.getElementById('modal'),
  );
}
