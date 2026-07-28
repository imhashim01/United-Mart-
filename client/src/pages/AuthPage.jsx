import AuthForm from '../features/auth/components/AuthForm';

export default function AuthPage({ mode = 'login' }) {
  return <AuthForm mode={mode} />;
}
