import { useContext } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import AuthContext, { AuthProvider } from './context/authContext';
import ExpenseProvider from './context/ExpenseProvider';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

function AuthLoading() {
  return (
    <div className='auth-page'>
      <p className='auth-loading'>Loading account...</p>
    </div>
  );
}

function AuthenticatedApp() {
  const { currentUser, isReady } = useContext(AuthContext);

  if (!isReady) {
    return <AuthLoading />;
  }

  if (!currentUser) {
    return <Navigate to='/auth' replace />;
  }

  return (
    <ExpenseProvider key={currentUser.id} accountId={currentUser.id}>
      <Dashboard />
    </ExpenseProvider>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthenticatedApp />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
