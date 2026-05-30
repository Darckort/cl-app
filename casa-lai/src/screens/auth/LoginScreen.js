import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import COLORS from '../../constants/colors';
import theme from '../../constants/theme';
import { Image as RNImage } from 'react-native';
import { validateEmail, validatePassword, validateEmailWithDomain } from '../../utils/validation';

// Intentar cargar la imagen
let logoImage;
try {
  logoImage = require('../../assets/images/LOGO.png');
} catch (e) {
  console.error('Error al cargar la imagen:', e);
  logoImage = null;
}

// Dominios de email permitidos (configurar según necesidad)
const ALLOWED_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
];

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageError, setImageError] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Verificar si la imagen existe
  useEffect(() => {
    if (!logoImage) {
      console.error('No se pudo cargar la imagen');
      setImageError(true);
    }
  }, []);

  useEffect(() => {
    // Limpiar errores al desmontar
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleLogin = () => {
    // Resetear errores
    setEmailError('');
    setPasswordError('');

    // Validar email
    if (!email.trim()) {
      setEmailError('El email es requerido');
      return;
    }
    if (!validateEmailWithDomain(email, ALLOWED_EMAIL_DOMAINS)) {
      setEmailError('Email inválido. Solo se permiten dominios: ' + ALLOWED_EMAIL_DOMAINS.join(', '));
      return;
    }

    // Validar contraseña
    if (!password.trim()) {
      setPasswordError('La contraseña es requerida');
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError('Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número');
      return;
    }

    dispatch(loginUser({ email, password, name: 'Usuario' }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          {logoImage ? (
            <Image
              source={logoImage}
              style={styles.logo}
              resizeMode="contain"
              onError={(e) => {
                console.log('Error al cargar la imagen:', e);
                setImageError(true);
              }}
            />
          ) : (
            <View style={[styles.logo, { backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: COLORS.primary }}>Logo no disponible</Text>
              <Text style={{ color: COLORS.primary, fontSize: 10 }}>Ruta: ../../../assets/images/LOGO.png</Text>
            </View>
          )}
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        <View style={styles.formContainer}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={[styles.input, emailError && styles.inputError]}
              placeholder="Ingresa tu correo"
              placeholderTextColor={COLORS.placeholder}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            {emailError ? <Text style={styles.fieldErrorText}>{emailError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={[styles.input, passwordError && styles.inputError]}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor={COLORS.placeholder}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              secureTextEntry
              editable={!loading}
            />
            {passwordError ? <Text style={styles.fieldErrorText}>{passwordError}</Text> : null}
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading || !email || !password}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              disabled={loading}
            >
              <Text style={styles.footerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    color: COLORS.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: COLORS.textSecondary,
  },
  formContainer: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: COLORS.danger + '20',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.body,
    color: COLORS.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  fieldErrorText: {
    ...theme.typography.caption,
    color: COLORS.danger,
    marginTop: theme.spacing.xs,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
    ...theme.shadow.md,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    ...theme.typography.body,
    color: COLORS.white,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  footerText: {
    ...theme.typography.body,
    color: COLORS.textSecondary,
  },
  footerLink: {
    ...theme.typography.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;
