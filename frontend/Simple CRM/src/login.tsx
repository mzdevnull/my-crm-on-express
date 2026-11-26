import { useState } from 'react';
import './login.css';
interface User {
  username: string;
  email: string
}

interface LoginProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
}
function Login({ onLogin, onSwitchToRegister }: LoginProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const API_URL = 'http://localhost:3000'
  

  const handleLogin = async (user: string, emailAddress: string, pass: string) => {
    if (!user || !emailAddress || !pass) {
      setResult('Пожалуйста, заполните все поля');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.trim(),
          email: emailAddress.trim(),
          password: pass,
        }),
      });

      const data = await response.json();

     if (!response.ok) {
  setResult(data.error || 'Ошибка входа');
} else {
  localStorage.setItem('token', data.token);

  setResult('User successfully logged in!');
  onLogin({ username: data.username, email: emailAddress.trim() });
}
    } catch (error) {
      setResult('Ошибка соединения с сервером');
    }
  };

  return (
    <>
     <div className="login-page">

      {/* Левая брендовая панель */}
      <aside className="login-brand">

        <div className="brand-logo">N</div>

        <h2>NORTHSTAR CRM</h2>
        <p className="brand-description">
          Управляйте клиентами, проектами и командой
          в одном рабочем пространстве.
        </p>

        <div className="brand-preview">
          <div className="preview-header">
            <span>Рабочее пространство</span>
            <span className="online-dot"></span>
          </div>

          <div className="preview-stats">
            <div>
              <span>Клиенты</span>
              <strong>128</strong>
            </div>
            <div>
              <span>Проекты</span>
              <strong>08</strong>
            </div>
          </div>
        </div>

        <span className="brand-footer">
          © 2026 NORTHSTAR CRM
        </span>
      </aside>

      {/* Правая часть */}
      <main className="login-content">
        <div className="login-card">

          <div className="login-heading">
            <span className="welcome-label">С ВОЗВРАЩЕНИЕМ</span>
            <h1>Войти в аккаунт</h1>
            <p>Введите свои данные для доступа к CRM.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(username, email, password);
            }}
          >
            <div className="form-group">
              <label htmlFor="login-username">Username</label>

              <input
                id="login-username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <div className="password-label">
                <label htmlFor="password">Пароль</label>
                <a href="#">Забыли пароль?</a>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Запомнить меня</label>
            </div>

            <button type="submit" className="login-button">
              Войти в CRM
              <span>→</span>
            </button>
          </form>

          {result && <p className="result-text">{result}</p>}

          <div className="login-divider"></div>

          <p className="login-help">
            Нет доступа? Обратитесь к администратору.
          </p>

          <div className="login-register">
            <span>Нет аккаунта?</span>
            <button type="button" onClick={onSwitchToRegister}>
              Создать аккаунт
            </button>
          </div>

        </div>
      </main>

    </div>
    </>
  );
}

export default Login;
