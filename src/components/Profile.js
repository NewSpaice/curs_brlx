import React, { useState } from 'react';
import { authService } from './authService'; // Импорт API
import './Profile.css';

const Profile = () => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
        const userData = await authService.login(loginData.email, loginData.password);
        
        // Сохраняем пользователя в localStorage
        localStorage.setItem('user', JSON.stringify(userData));

        alert('Успешный вход!');
        
        // Перенаправляем на профиль
        window.location.href = '/user-profile';  
    } catch (err) {
        setError(err.message);
    }
};
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (registerData.password !== registerData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      await authService.register({
        username: registerData.email, // предполагается, что сервер использует email как username
        password: registerData.password,
        password2: registerData.confirmPassword,
        first_name: registerData.first_name,
        last_name: registerData.last_name,
      });
      alert('Регистрация успешна!');
      setIsLoginTab(true); // Переключаемся на вкладку входа
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="profile-container">
      <div className="auth-form">
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLoginTab ? 'active' : ''}`} 
            onClick={() => setIsLoginTab(true)}
          >
            Вход
          </button>
          <button 
            className={`auth-tab ${!isLoginTab ? 'active' : ''}`} 
            onClick={() => setIsLoginTab(false)}
          >
            Регистрация
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {isLoginTab ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Пароль</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>
            <button className="submit-button" type="submit">Войти</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Имя</label>
              <input
                type="text"
                value={registerData.firstName}
                onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Фамилия</label>
              <input
                type="text"
                value={registerData.lastName}
                onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Пароль</label>
              <input
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Подтвердите пароль</label>
              <input
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              />
            </div>
            <button className="submit-button" type="submit">Зарегистрироваться</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;