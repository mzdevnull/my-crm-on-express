import { useState } from 'react';
import './register.css';

interface RegisterProps {
  onSwitchToLogin: () => void;
  onLogin: (user: User) => void;
  onResult: (value: string) => void;
}
interface User {
  username: string;
  email?: string;
}

function Register({ onSwitchToLogin, onLogin, onResult }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  
  const API_URL = 'http://localhost:3000'
  

  const handleRegister = async (user: string, emailAddress: string, pass: string) => {
    if (!user || !emailAddress || !pass) {
      setResult('Пожалуйста, заполните все поля');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user,
          email: emailAddress.trim(),
          password: pass,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResult(data.error || 'Ошибка регистрации');
      } else {
        onResult(data.username);

        const loginResponse = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user.trim(), email: emailAddress.trim(), password: pass }),
        });
        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {
          setResult('Регистрация выполнена. Войдите в аккаунт.');
          return;
        }

        localStorage.setItem('token', loginData.token);
        onLogin({ username: loginData.username, email: loginData.email ?? emailAddress.trim() });
      }
    } catch (error) {
      setResult('Ошибка соединения с сервером');
    }
  };

  return (
    <>
      <div className="register-page">
      <section className="register-brand">
        <div className="brand-logo">N</div>

        <div className="brand-content">
          <span className="brand-label">NORTHSTAR CRM</span>

          <h1>
            Organize your work.
            <br />
            Grow your business.
          </h1>

          <p>
            One workspace for your clients, projects,
            deals and everyday tasks.
          </p>
        </div>

        <div className="brand-footer">
          © 2026 NORTHSTAR CRM
        </div>
      </section>

      <main className="register-content">
        <div className="register-card">
          <div className="register-heading">
            <span className="register-label">GET STARTED</span>
            <h2>Create your account</h2>
            <p>Fill in your details to get started with NORTHSTAR.</p>
          </div>

          <form onSubmit={(event) => {
            event.preventDefault();
            handleRegister(username, email, password);
          }}>
            <div className="register-field">
              <label htmlFor="register-email">Email</label>
              <input
                id="register-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="register-field">
              <label>Username</label>
              <input
                placeholder="Enter your username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="register-field">
              <label>Password</label>
              <input
                placeholder="Create a password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="register-submit" type="submit">
              Create account
              <span>→</span>
            </button>
          </form>

          {result && (
            <p className="register-result">
              {result}
            </p>
          )}

          <div className="register-switch">
            <span>Already have an account?</span>
            <button type="button" onClick={onSwitchToLogin}>
              Log in
            </button>
          </div>
        </div>

        <div className="register-bottom">
          Secure workspace · NORTHSTAR CRM
        </div>
      </main>
    </div>
    </>
  );
}

export default Register;
