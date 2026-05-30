/**
 * Utilidades para llamadas API seguras
 * Previene inyecciones SQL y otros ataques al comunicarse con la API
 */

import { sanitizeForAPI } from './sanitization';

// Configuración de la API
const API_CONFIG = {
  baseURL: 'https://tu-api.com/api', // Reemplazar con la URL real de la API
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Sanitiza y prepara los datos para enviar a la API
 * @param {Object} data - Datos a enviar
 * @param {Object} schema - Esquema de sanitización
 * @returns {Object} - Datos sanitizados
 */
const prepareAPIData = (data, schema = null) => {
  if (!data || typeof data !== 'object') {
    return {};
  }

  return sanitizeForAPI(data, schema);
};

/**
 * Realiza una petición GET segura
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} params - Parámetros de la query
 * @param {Object} schema - Esquema de sanitización
 * @returns {Promise} - Respuesta de la API
 */
export const secureGet = async (endpoint, params = {}, schema = null) => {
  try {
    // Sanitizar parámetros
    const sanitizedParams = prepareAPIData(params, schema);

    // Construir URL con parámetros sanitizados
    const url = new URL(`${API_CONFIG.baseURL}${endpoint}`);
    Object.keys(sanitizedParams).forEach(key => {
      if (sanitizedParams[key] !== undefined && sanitizedParams[key] !== null) {
        url.searchParams.append(key, sanitizedParams[key]);
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        ...API_CONFIG.headers,
        // Agregar token de autenticación si existe
        // 'Authorization': `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(API_CONFIG.timeout),
    });

    return await handleResponse(response);
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Realiza una petición POST segura
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} data - Datos a enviar
 * @param {Object} schema - Esquema de sanitización
 * @returns {Promise} - Respuesta de la API
 */
export const securePost = async (endpoint, data = {}, schema = null) => {
  try {
    // Sanitizar datos
    const sanitizedData = prepareAPIData(data, schema);

    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...API_CONFIG.headers,
        // Agregar token de autenticación si existe
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(sanitizedData),
      signal: AbortSignal.timeout(API_CONFIG.timeout),
    });

    return await handleResponse(response);
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Realiza una petición PUT segura
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} data - Datos a enviar
 * @param {Object} schema - Esquema de sanitización
 * @returns {Promise} - Respuesta de la API
 */
export const securePut = async (endpoint, data = {}, schema = null) => {
  try {
    // Sanitizar datos
    const sanitizedData = prepareAPIData(data, schema);

    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: {
        ...API_CONFIG.headers,
        // Agregar token de autenticación si existe
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(sanitizedData),
      signal: AbortSignal.timeout(API_CONFIG.timeout),
    });

    return await handleResponse(response);
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Realiza una petición DELETE segura
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} params - Parámetros de la query
 * @param {Object} schema - Esquema de sanitización
 * @returns {Promise} - Respuesta de la API
 */
export const secureDelete = async (endpoint, params = {}, schema = null) => {
  try {
    // Sanitizar parámetros
    const sanitizedParams = prepareAPIData(params, schema);

    // Construir URL con parámetros sanitizados
    const url = new URL(`${API_CONFIG.baseURL}${endpoint}`);
    Object.keys(sanitizedParams).forEach(key => {
      if (sanitizedParams[key] !== undefined && sanitizedParams[key] !== null) {
        url.searchParams.append(key, sanitizedParams[key]);
      }
    });

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        ...API_CONFIG.headers,
        // Agregar token de autenticación si existe
        // 'Authorization': `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(API_CONFIG.timeout),
    });

    return await handleResponse(response);
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Maneja la respuesta de la API
 * @param {Response} response - Respuesta de fetch
 * @returns {Promise} - Datos de la respuesta
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new APIError(
        data.message || 'Error en la petición',
        response.status,
        data
      );
    }
    
    return data;
  }
  
  if (!response.ok) {
    throw new APIError(
      'Error en la petición',
      response.status
    );
  }
  
  return response.text();
};

/**
 * Maneja errores de la API
 * @param {Error} error - Error capturado
 * @returns {APIError} - Error formateado
 */
const handleAPIError = (error) => {
  if (error instanceof APIError) {
    return error;
  }
  
  if (error.name === 'AbortError' || error.name === 'TimeoutError') {
    return new APIError('Tiempo de espera agotado', 408);
  }
  
  if (error.message.includes('NetworkError')) {
    return new APIError('Error de conexión', 0);
  }
  
  return new APIError(error.message || 'Error desconocido', 500);
};

/**
 * Clase personalizada para errores de API
 */
class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Esquemas de sanitización predefinidos para endpoints comunes
 */
export const API_SCHEMAS = {
  // Autenticación
  login: {
    email: { type: 'email' },
    password: { type: 'sql' },
  },
  register: {
    email: { type: 'email' },
    password: { type: 'sql' },
    name: { type: 'text', maxLength: 100 },
    phone: { type: 'phone' },
  },
  
  // Productos
  searchProducts: {
    query: { type: 'text', maxLength: 100 },
    category: { type: 'text', maxLength: 50 },
  },
  
  // Pagos
  createPayment: {
    phone: { type: 'phone' },
    reference: { type: 'reference' },
    bankId: { type: 'text', maxLength: 4 },
    amount: { type: 'number' },
  },
  
  // Carrito
  addToCart: {
    productId: { type: 'text' },
    quantity: { type: 'number' },
  },
  
  // Perfil
  updateProfile: {
    name: { type: 'text', maxLength: 100 },
    email: { type: 'email' },
    phone: { type: 'phone' },
    address: { type: 'text', maxLength: 200 },
  },
};

/**
 * Configura la URL base de la API
 * @param {string} baseURL - Nueva URL base
 */
export const setAPIBaseURL = (baseURL) => {
  API_CONFIG.baseURL = baseURL;
};

/**
 * Configura los headers por defecto
 * @param {Object} headers - Headers adicionales
 */
export const setDefaultHeaders = (headers) => {
  API_CONFIG.headers = {
    ...API_CONFIG.headers,
    ...headers,
  };
};

/**
 * Configura el timeout de las peticiones
 * @param {number} timeout - Timeout en milisegundos
 */
export const setAPITimeout = (timeout) => {
  API_CONFIG.timeout = timeout;
};

export default {
  secureGet,
  securePost,
  securePut,
  secureDelete,
  prepareAPIData,
  API_SCHEMAS,
  setAPIBaseURL,
  setDefaultHeaders,
  setAPITimeout,
  APIError,
};
