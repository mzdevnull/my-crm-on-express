import { useState } from 'react';
import './register.css';
interface LoginProps {
  onLogin: () => void;
}
function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const API_URL = 'http://localhost:3000'
  

  const handleLogin = async (user: string, pass: string) => {
    if (!user || !pass) {
      setResult('Пожалуйста, заполните все поля');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user,
          password: pass,
        }),
      });

      const data = await response.json();

     if (!response.ok) {
  setResult(data.error || 'Ошибка входа');
} else {
  localStorage.setItem('token', data.token);

  console.log('JWT saved:', localStorage.getItem('token'));

  setResult('User successfully logged in!');
  onLogin();
}
    } catch (error) {
      setResult('Ошибка соединения с сервером');
    }
  };

  return (
    <>
      <div className="register-card">
      <h1>Login Page</h1>
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
      <button onClick={()=>handleLogin(username,password)}>Login</button>
      <p className={`result-text ${status}`}>{result}</p>
    </div>
    </>
  );
}

export default Login;
