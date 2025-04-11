import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './Home';
import Profile from './components/Profile'; // Страница входа/регистрации
import UserProfile from './components/UserProfile'; // Личный кабинет пользователя
import Catalog from './components/Catalog';
import Services from './components/Services';
import Promotions from './components/Promotions';
import About from './components/About';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null);

  // Загружаем информацию о пользователе из localStorage при монтировании компонента
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
  
        const response = await fetch("http://localhost:8000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) {
          console.error("Ошибка загрузки пользователя");
          return;
        }
  
        const data = await response.json();
        
        setUser({...data,
          avatar:`http://localhost:8000${data.avatar}`,
        }); // Обновляем состояние пользователя
      } catch (error) {
        console.error("Ошибка:", error);
      }
      
    };
 
    fetchUser();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('user'); // Удаляем данные пользователя при выходе
    setUser(null); // Сбрасываем состояние пользователя
  };

  return (
    <Router>
      <div className="App">
        <nav className="navigation">
          <div className="nav-logo">
            <Link to="/">
            <img src = "brllogo.png"/>
            </Link>
          </div>
          <div className="nav-links">
            <Link to="/services">Услуги</Link>
            <Link to="/catalog">Ассортимент</Link>
            <Link to="/promotions">Акции</Link>
            <Link to="/about">О нас</Link>
          </div>
          <div className="nav-profile">
  {user ? (
    <div className="profile-info">
      <Link to="/user-profile" className="profile-link">
        <img src={user.avatar || "/profile-icon.png"} alt="Аватар" className="profile-icon" />
        <span>{user.first_name}</span>
      </Link>
    </div>
  ) : (
    <Link to="/profile">Войти</Link>
  )}
</div>
<div className="contact-info">
  <p>Часы работы: 09:00 - 20:31 Контакты: 52CrDi@yandex.ru / Tg канал: @52CrDi / Номер телефона: +7 (952) 812 52 52</p>
</div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/about" element={<About />} />
          {/* Страница входа/регистрации */}
          <Route path="/profile" element={<Profile setUser={setUser} />} />
          {/* Личный профиль пользователя */}
          <Route path="/user-profile" element={<UserProfile user={user} onLogout={handleLogout} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
