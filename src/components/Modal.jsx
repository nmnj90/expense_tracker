import { createPortal } from 'react-dom';

export default function Modal({ type, tone, children, ref }) {
  const variant = tone || type;

  return createPortal(
    <dialog className={`modal modal--${variant}`} ref={ref}>
      <h1>{type}</h1>
      {children}
      <form method='dialog'>
        <button type='submit'>Close</button>
      </form>
    </dialog>,
    document.getElementById('modal'),
  );
}
