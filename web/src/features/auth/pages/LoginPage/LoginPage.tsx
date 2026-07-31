import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import styles from './LoginPage.module.css';

// ─── Tipos auxiliares ─────────────────────────────────────────────────────────

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// ─── Ícones SVG inline ────────────────────────────────────────────────────────

const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c4.97 0 9 4.03 9 9-4.97 0-9-4.03-9-9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3C7.03 3 3 7.03 3 12c4.97 0 9-4.03 9-9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v9" />
  </svg>
);

const MailIcon = () => (
  <svg className={styles.inputIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

const LockIcon = () => (
  <svg className={styles.inputIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z" />
  </svg>
);

const AlertIcon = () => (
  <svg className={styles.errorIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

// ─── Componente ───────────────────────────────────────────────────────────────

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Handler de submit ───────────────────────────────────────────────────────

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Validação frontend
    if (!email.trim() || !password.trim()) {
      setError('Preencha todos os campos para continuar.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const message =
        apiError?.response?.data?.message ??
        'Credenciais inválidas. Verifique seu e-mail e senha.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        {/* Logo / Ícone decorativo */}
        <div className={styles.logoWrapper}>
          <div className={styles.logoIcon}>
            <LeafIcon />
          </div>
        </div>

        {/* Título */}
        <h1 className={styles.title}>Entrar</h1>
        <p className={styles.subtitle}>Bem-vindo de volta à plataforma</p>

        {/* Mensagem de erro da API */}
        {error && (
          <div className={styles.errorMessage} role="alert">
            <AlertIcon />
            <span>{error}</span>
          </div>
        )}

        {/* Formulário */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Campo: E-mail */}
          <div className={styles.inputGroup}>
            <label htmlFor="login-email" className={styles.label}>
              E-mail
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="login-email"
                type="email"
                className={styles.input}
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={isSubmitting}
              />
              <MailIcon />
            </div>
          </div>

          {/* Campo: Senha */}
          <div className={styles.inputGroup}>
            <label htmlFor="login-password" className={styles.label}>
              Senha
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="login-password"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={isSubmitting}
              />
              <LockIcon />
            </div>
          </div>

          {/* Botão submit */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Link para registro */}
        <p className={styles.registerLink}>
          Não tem conta?{' '}
          <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
