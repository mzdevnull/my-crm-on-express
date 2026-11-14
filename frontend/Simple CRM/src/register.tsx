import { useState } from 'react';
import './register.css';

interface RegisterProps {
    onSwitchToLogin: () => void;
  }
function Register({ onSwitchToLogin }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const API_URL = 'http://localhost:3000'
  

  const handleRegister = async (user: string, pass: string) => {
    if (!user || !pass) {
      setResult('Пожалуйста, заполните все поля');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user,
          password: pass,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResult(data.error || 'Ошибка регистрации');
      } else {
        setResult('User successfully registered!');
      }
    } catch (error) {
      setResult('Ошибка соединения с сервером');
    }
  };

  return (
    <>
      <div className="register-card">
        <h1>Register Page</h1>
        <input
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => handleRegister(username, password)}>Register</button>
          <button type="button" onClick={onSwitchToLogin}>
      Already have an account? Log In!
    </button>
      </div>
    </>
  );
}

export default Register;
