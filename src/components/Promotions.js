import React, { useState, useEffect } from 'react';
import './Promotions.css';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/promotions/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке акций');
      }

      const data = await response.json();
      setPromotions(data);
      setLoading(false);
    } catch (error) {
      setError('Не удалось загрузить акции');
      setLoading(false);
    }
  };

  const handleApplyPromotion = async (promotionId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/promotions/${promotionId}/apply/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при активации акции');
      }

      // Обновляем список акций после успешной активации
      fetchPromotions();
      alert('Акция успешно активирована! Она будет доступна при оформлении следующего заказа.');
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div className="loading">Загрузка акций...</div>;
  if (error) return <div className="error">{error}</div>;

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Promotions; 