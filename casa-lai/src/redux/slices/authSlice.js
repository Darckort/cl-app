import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail, validatePassword } from '../../utils/validation';
import { sanitizeForAPI } from '../../utils/sanitization';

// Configuración de rate limiting
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos en milisegundos

// Función para obtener intentos de login fallidos
const getLoginAttempts = async () => {
  try {
    const attempts = await AsyncStorage.getItem('loginAttempts');
    const timestamp = await AsyncStorage.getItem('loginAttemptsTimestamp');
    return {
      count: attempts ? parseInt(attempts) : 0,
      timestamp: timestamp ? parseInt(timestamp) : null
    };
  } catch (error) {
    return { count: 0, timestamp: null };
  }
};

// Función para incrementar intentos de login fallidos
const incrementLoginAttempts = async () => {
  try {
    const { count } = await getLoginAttempts();
    await AsyncStorage.setItem('loginAttempts', (count + 1).toString());
    await AsyncStorage.setItem('loginAttemptsTimestamp', Date.now().toString());
  } catch (error) {
    console.error('Error incrementing login attempts:', error);
  }
};

// Función para resetear intentos de login
const resetLoginAttempts = async () => {
  try {
    await AsyncStorage.removeItem('loginAttempts');
    await AsyncStorage.removeItem('loginAttemptsTimestamp');
  } catch (error) {
    console.error('Error resetting login attempts:', error);
  }
};

// Función para verificar si el usuario está bloqueado
const isUserLockedOut = async () => {
  try {
    const { count, timestamp } = await getLoginAttempts();
    
    if (count >= MAX_LOGIN_ATTEMPTS && timestamp) {
      const timeSinceLastAttempt = Date.now() - timestamp;
      if (timeSinceLastAttempt < LOCKOUT_TIME) {
        const remainingTime = Math.ceil((LOCKOUT_TIME - timeSinceLastAttempt) / 60000); // minutos restantes
        return { locked: true, remainingTime };
      } else {
        // Resetear si ya pasó el tiempo de bloqueo
        await resetLoginAttempts();
      }
    }
    
    return { locked: false, remainingTime: 0 };
  } catch (error) {
    console.error('Error checking lockout status:', error);
    return { locked: false, remainingTime: 0 };
  }
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      // Verificar si el usuario está bloqueado por demasiados intentos
      const { locked, remainingTime } = await isUserLockedOut();
      if (locked) {
        return rejectWithValue(
          `Demasiados intentos fallidos. Intenta nuevamente en ${remainingTime} minutos.`
        );
      }

      // Validar email
      if (!validateEmail(userData.email)) {
        await incrementLoginAttempts();
        return rejectWithValue('Email inválido');
      }

      // Validar contraseña (si se proporciona)
      if (userData.password && !validatePassword(userData.password)) {
        await incrementLoginAttempts();
        return rejectWithValue(
          'Contraseña inválida. Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número.'
        );
      }

      // Sanitizar datos antes de procesar
      const sanitizedData = sanitizeForAPI(userData, {
        email: { type: 'email' },
        password: { type: 'sql' },
        name: { type: 'text', maxLength: 100 }
      });

      return new Promise((resolve) => {
        setTimeout(async () => {
          // Aquí se conectaría con la API real
          // Por ahora, simulamos una respuesta exitosa
          const user = {
            id: '1',
            email: sanitizedData.email,
            name: sanitizedData.name || 'Usuario',
            token: 'dummy-jwt-token' // En producción, esto vendría de la API
          };
          
          await AsyncStorage.setItem('userToken', user.token);
          await AsyncStorage.setItem('userData', JSON.stringify(user));
          
          // Resetear intentos de login exitoso
          await resetLoginAttempts();
          
          resolve({
            user,
            isAuthenticated: true
          });
        }, 1000);
      });
    } catch (error) {
      await incrementLoginAttempts();
      return rejectWithValue(error.message);
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        return {
          user: JSON.parse(userData),
          isAuthenticated: true
        };
      }
      return { user: null, isAuthenticated: false };
    } catch (error) {
      return rejectWithValue('Error al verificar autenticación');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      return { user: null, isAuthenticated: false };
    } catch (error) {
      return rejectWithValue('Error al cerrar sesión');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  appReady: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    });
    
    // Check Auth
    builder.addCase(checkAuth.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.appReady = true;
    });
    builder.addCase(checkAuth.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.appReady = true;
    });
    
    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
