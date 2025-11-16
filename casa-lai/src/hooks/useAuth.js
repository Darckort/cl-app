import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../redux/slices/authSlice';

export const useAuth = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector(state => state.auth || {});

  const signIn = useCallback(async (credentials) => {
    try {
      setError(null);
      // Simular llamada a API de autenticación
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (credentials.email && credentials.password) {
            resolve({ 
              user: { 
                id: '1', 
                name: 'Usuario Demo', 
                email: credentials.email,
                token: 'dummy-jwt-token'
              } 
            });
          } else {
            reject(new Error('Credenciales inválidas'));
          }
        }, 1000);
      });
      
      dispatch(login(response.user));
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Error de autenticación';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  const signOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const signUp = useCallback(async (userData) => {
    try {
      setError(null);
      // Simular registro de usuario
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Aquí iría la lógica de registro real
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Error en el registro';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  return {
    user,
    isAuthenticated: !!isAuthenticated,
    loading: !!loading,
    error,
    signIn,
    signOut,
    signUp
  };
};

export default useAuth;
