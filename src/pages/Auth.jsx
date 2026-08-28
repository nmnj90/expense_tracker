import { useContext, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Input from '../components/Input';
import AuthContext from '../context/authContext';
import { firebaseProjectId } from '../firebase';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Auth() {
  const { currentUser, isReady, isConfigured, createAccount, login } =
    useContext(AuthContext);
  const [mode, setMode] = useState('create');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  if (!isReady) {
    return (
      <div className='auth-page'>
        <p className='auth-loading'>Loading account...</p>
      </div>
    );
  }

  if (currentUser) {
    return <Navigate to='/' replace />;
  }

  const isCreate = mode === 'create';

  async function onSubmitHandler(event) {
    event.preventDefault();

    const name = nameRef.current?.value.trim() || '';
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;
    const nextErrors = {};

    if (isCreate && !name) {
      nextErrors.name = 'Name is required.';
    }
    if (!email) {
      nextErrors.email = 'Email is required.';
    } else if (!EMAIL_PATTERN.test(email)) {
      nextErrors.email = 'Enter a valid email.';
    }
    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (isCreate) {
        await createAccount({ name, email, password });
      } else {
        await login({ email, password });
      }
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setErrors({});
  }

  return (
    <div className='auth-page'>
      <div className='auth-card'>
        <p className='auth-card__eyebrow'>Expense Tracker</p>
        <h1 className='auth-card__title'>
          {isCreate ? 'Create an account' : 'Welcome back'}
        </h1>
        <p className='auth-card__subtitle'>
          {isCreate
            ? 'Set up your account first, then start adding costs and income.'
            : 'Log in to open the account where your expenses are saved.'}
        </p>
        {isConfigured ? null : (
          <p className='form-error'>
            Firebase is not configured yet. Copy `.env.example` to `.env.local`
            and add your Firebase web app keys.
          </p>
        )}

        <form className='form' key={mode} onSubmit={onSubmitHandler}>
          {isCreate ? (
            <Input
              ref={nameRef}
              label='Name'
              type='text'
              id='account-name'
              name='name'
              autoComplete='name'
              error={errors.name}
            />
          ) : null}
          <Input
            ref={emailRef}
            label='Email'
            type='email'
            id='account-email'
            name='email'
            autoComplete='email'
            error={errors.email}
          />
          <Input
            ref={passwordRef}
            label='Password'
            type='password'
            id='account-password'
            name='password'
            autoComplete={isCreate ? 'new-password' : 'current-password'}
            error={errors.password}
          />
          {errors.form ? <p className='form-error'>{errors.form}</p> : null}
          <button type='submit' disabled={isSubmitting}>
            {isSubmitting
              ? isCreate
                ? 'Creating account...'
                : 'Logging in...'
              : isCreate
                ? 'Create account'
                : 'Log in'}
          </button>
        </form>

        <p className='auth-card__switch'>
          {isCreate ? 'Already have an account?' : 'Need an account?'}{' '}
          <button
            type='button'
            className='auth-card__link'
            onClick={() => switchMode(isCreate ? 'login' : 'create')}
          >
            {isCreate ? 'Log in' : 'Create one'}
          </button>
        </p>
        {isConfigured ? (
          <p className='auth-card__project'>Firebase project: {firebaseProjectId}</p>
        ) : null}
      </div>
    </div>
  );
}
