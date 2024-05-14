import { useContext } from 'react';
import AppContext from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function AuthenticatedRoute({ children }) {
  const { user, setUser } = useContext(AppContext);
  const location = useLocation();

  if (user === null) {
    return (
      <Navigate to="/" path={location.pathname}>
        {' '}
      </Navigate>
    );
  }

  return children;
}
