import React, { useState, useEffect } from 'react';
import './Promotions.css';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  const fetchPromotions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Необходима авторизация');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/promotions/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке акций');
      }

      const data = await response.json();
      setPromotions(data.map(promotion => ({
        ...promotion,
        image: promotion.image ? `${process.env.REACT_APP_API_URL || ''}${promotion.image}` : '/promotion-placeholder.png'
      })));
      setLoading(false);
    } catch (error) {
      setError(error.message || 'Не удалось загрузить акции');
      setLoading(false);
    }
  };

  const handleApplyPromotion = async (promotionId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Необходима авторизация');
      }

      const response = await fetch(`/api/promotions/${promotionId}/apply/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка при активации акции');
      }

      await fetchPromotions();
      alert('Акция успешно активирована! Она будет доступна при оформлении следующего заказа.');
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div className="loading">Загрузка акций...</div>;
  if (error) return <div className="error">{error}</div>;
  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <div className="promotions-container">
      <h1>Акции и скидки</h1>
      <div className="promotions-grid">
        {promotions.map(promotion => (
          <div key={promotion.id} className="promotion-card">
            <h3>{promotion.name}</h3>
            <p>{promotion.description}</p>
            <div className="promotion-details">
              <span className="discount">{promotion.discount_percent}% скидка</span>
              <span className="dates">
                {new Date(promotion.start_date).toLocaleDateString()} - 
                {new Date(promotion.end_date).toLocaleDateString()}
              </span>
            </div>
            <button 
              className={`apply-button ${promotion.is_activated ? 'activated' : ''} ${promotion.is_used ? 'used' : ''}`}
              onClick={() => handleApplyPromotion(promotion.id)}
              disabled={promotion.is_activated || promotion.is_used}
            >
              {promotion.is_used ? 'Акция использована' : 
               promotion.is_activated ? 'Акция активирована' : 
               'Активировать акцию'}
            </button>
            <img 
              src={promotion.image} 
              alt={`Акция: ${promotion.name}`}
              className="promotion-image" 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Promotions; 