import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression'; // Добавляем библиотеку для обработки изображений
import './UserProfile.css';

const API_BASE = 'http://localhost:8000/api';

const UserProfile = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
    fetchOrders();
  }, []);

  // Добавим периодическое обновление заказов
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000); // Обновление каждые 30 секунд

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout(); // Вызываем переданную функцию выхода
    window.location.href = '/';  // Редирект на главную страницу
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Ошибка авторизации. Войдите в систему.');
        return;
      }

      const response = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setError('Ошибка загрузки профиля.');
        return;
      }
     
      const data = await response.json();
      if (data.avatar) {
        console.log('ya huesos');
        fetchAvatar(data.avatar);
      }
  
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err) {
      setError('Ошибка загрузки профиля.');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Ошибка авторизации. Войдите в систему.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setError(`Ошибка сервера: ${response.status}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setOrders(data || []);
    } catch (err) {
      setError('Ошибка загрузки заказов.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 0.3, // Ограничение размера (300 KB)
      maxWidthOrHeight: 512, // Максимальная ширина/высота
      useWebWorker: true,
    };

    try {
      // Сжимаем изображение перед отправкой
      const compressedFile = await imageCompression(file, options);

      console.log('Размер до:', file.size, 'Размер после:', compressedFile.size);

      const formData = new FormData();
      formData.append('avatar', compressedFile, file.name);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/users/avatar_upload/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        setError('Ошибка загрузки аватара.');
        return;
      }

      const data = await response.json();
      fetchAvatar(data.avatar);
    } catch (err) {
      setError('Ошибка обработки изображения.');
      console.error('Ошибка сжатия:', err);
    }
  };

  // 🔄 Функция для загрузки и конвертации аватара
  const fetchAvatar = async (avatarUrl) => {
    const apibase = API_BASE.replace('/api', '');
    console.log(apibase);
    try {
      const response = await fetch(`${apibase}/${avatarUrl}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Ошибка загрузки аватара.');
      }

      const blob = await response.blob(); // Получаем Blob
      const objectURL = URL.createObjectURL(blob); // Конвертируем в URL
      console.log("Avatar URL:", objectURL);
      console.log(process.env.REACT_APP_API_BASE);
      setUser((prevUser) => {
        const updatedUser = { ...prevUser, avatar: `${apibase}/${avatarUrl}` }; //ГИГА КОСТЫЛЬ
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });
    } catch (err) {
      setError('Ошибка загрузки аватара.');
      console.error(err);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/users/avatar_delete/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setError('Ошибка удаления аватара.');
        return;
      }

      setUser((prevUser) => {
        const updatedUser = { ...prevUser, avatar: null };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });
    } catch (err) {
      setError('Ошибка удаления аватара.');
    }
  };

  const handlePayment = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/orders/${orderId}/process_payment/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при оплате');
      }

      //const data = await response.json();
      // Обновляем список заказов после успешной оплаты
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, payment_status: 'completed', status: 'processing' }
          : order
      ));

      alert('Оплата прошла успешно!');
    } catch (error) {
      alert(error.message || 'Произошла ошибка при оплате');
    }
  };

  // Обновим отображение статусов заказа
  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'В обработке',
      'processing': 'Обрабатывается',
      'shipped': 'Отправлен',
      'delivered': 'Доставлен',
      'cancelled': 'Отменен'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>Личный кабинет</h2>
        <button onClick={handleLogout} className="logout-button">Выйти</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="profile-info">
        <div className="avatar-section">
          <img
            src={user?.avatar ? user.avatar : "./profile-icon.png"}
            className="avatar"
            alt="Фото профиля пользователя"
          />
          {!user?.avatar && <input type="file" accept="image/*" onChange={handleAvatarChange} />}
          {user?.avatar && <button onClick={handleRemoveAvatar} className="remove-avatar-button">Удалить аватар</button>}
        </div>
        <h3>{user?.first_name || 'Неизвестно'}</h3>
        <p>Email: {user?.email || 'Неизвестно'}</p>
      </div>

      <div className="orders-section">
        <h3>Мои заказы</h3>
        {loading ? (
          <p>Загрузка заказов...</p>
        ) : orders.length > 0 ? (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className="order-number">Заказ #{order.id}</span>
                  <div className="order-status">
                    <span>Статус заказа:</span>
                    <span className={`status status-${order.status}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
                <div className="order-details">
                  <div className="order-items">
                    {Array.isArray(order.items) ? (
                      order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          {item.product_name && (
                            <>
                              <span>Товар: {item.product_name}</span>
                              <span>x{item.quantity || '1'}</span>
                              <span>{item.price} ₽</span>
                            </>
                          )}
                          {item.service_name && (
                            <>
                              <span>Услуга: {item.service_name}</span>
                              <span className="service-price">Цена договорная</span>
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>Нет товаров или услуг в заказе</p>
                    )}
                  </div>
                  <div className="order-info">
                    <div className="order-payment-status">
                      <span>Статус оплаты:</span>
                      <span className={`payment-status status-${order.payment_status}`}>
                        {order.payment_status === 'pending' && 'Ожидает оплаты'}
                        {order.payment_status === 'completed' && 'Оплачен'}
                        {order.payment_status === 'failed' && 'Ошибка оплаты'}
                      </span>
                    </div>
                    {order.payment_status === 'pending' && (
                      <button 
                        className="pay-button"
                        onClick={() => handlePayment(order.id)}
                      >
                        Оплатить
                      </button>
                    )}
                    <div className="order-total">
                      <span>Итого:</span>
                      <span>{order.total_amount} ₽</span>
                    </div>
                    <div className="order-date">
                      <span>Дата заказа:</span>
                      <span>{new Date(order.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-orders">У вас пока нет заказов</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
