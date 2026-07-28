import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  verifyEmail as verifyEmailApi,
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
} from '../api/authApi';

// IMPORTANT: the backend wraps every response as
//   { success, statusCode, message, data: <payload> }
// via sendResponse()/ApiResponse. Axios then puts that whole JSON body at
// `response.data`, so the actual payload is one level deeper, at
// `response.data.data` — never `response.data` directly. Login/register/
// refresh send `{ user, accessToken }` as that payload; getMe sends the
// user object directly. Losing track of this nesting (or the accessToken
// field name) silently sets user/token to undefined, which is why auth
// state — and any role-based redirect relying on it — used to fail even
// though the login request itself succeeded.

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      setAuth: (user, token) => {
        localStorage.setItem('authToken', token);
        set({ user, token, error: null });
      },

      clearAuth: () => {
        localStorage.removeItem('authToken');
        set({ user: null, token: null, error: null });
      },

      register: async (payload) => {
        set({ loading: true, error: null });
        try {
          const response = await registerUser(payload);
          const { user } = response.data.data;
          return { user };
        } catch (error) {
          set({ error: error.response?.data?.message || 'Registration failed' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      login: async (payload) => {
        set({ loading: true, error: null });
        try {
          const response = await loginUser(payload);
          const { user, accessToken } = response.data.data;
          get().setAuth(user, accessToken);
          return { user, accessToken };
        } catch (error) {
          set({ error: error.response?.data?.message || 'Login failed' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await logoutUser();
        } catch {
          // Even if the server call fails (e.g. token already expired),
          // still clear local state so the user isn't stuck "logged in".
        } finally {
          get().clearAuth();
          set({ loading: false });
        }
      },

      verifyEmail: async (token) => {
        set({ loading: true, error: null });
        try {
          const response = await verifyEmailApi(token);
          return response.data;
        } catch (error) {
          set({ error: error.response?.data?.message || 'Verification failed' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      forgotPassword: async (email) => {
        set({ loading: true, error: null });
        try {
          const response = await forgotPasswordApi(email);
          return response.data;
        } catch (error) {
          set({ error: error.response?.data?.message || 'Password reset request failed' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      resetPassword: async (token, password) => {
        set({ loading: true, error: null });
        try {
          const response = await resetPasswordApi({ token, password });
          return response.data;
        } catch (error) {
          set({ error: error.response?.data?.message || 'Password reset failed' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      hydrate: async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        set({ loading: true });
        try {
          const response = await getMe();
          // getMe's controller sends the user object directly as the data
          // payload (not wrapped in { user }) — see authController.js.
          set({ user: response.data.data, token });
        } catch {
          get().clearAuth();
        } finally {
          set({ loading: false });
        }
      },
    }),
    { name: 'united-mart-auth' }
  )
);
