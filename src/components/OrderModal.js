import React, { useState, useEffect } from 'react';

const OrderModal = ({ item, type, onSubmit, onClose }) => {
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postal_code: '',
    country: 'Россия'
  });
  const [quantity, setQuantity] = useState(1);
  const [availablePromotions, setAvailablePromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  useEffect(() => {
    fetchAvailablePromotions();
  }, []);

  const fetchAvailablePromotions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/promotions/available/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAvailablePromotions(data);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  const calculateTotal = () => {
    const basePrice = type === 'product' ? item.price * quantity : 0;
    if (selectedPromotion && type === 'product') {
      const discount = (basePrice * selectedPromotion.discount_percent) / 100;
      return basePrice - discount;
    }
    return basePrice;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      items: [{
        product_id: type === 'product' ? item.id : null,
        product_name: type === 'product' ? item.name : null,
        service_name: type === 'service' ? item.name : null,
        price: type === 'product' ? item.price : '---',
        quantity: type === 'product' ? quantity : 1
      }],
      total_amount: calculateTotal(),
      status: 'pending',
      shipping_address: shippingAddress,
      payment_status: 'pending',
      promotion_id: selectedPromotion?.id,
      type: type
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Оформление {type === 'product' ? 'заказа' : 'услуги'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Адрес:</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({
                ...shippingAddress,
                address: e.target.value
              })}
              required
            />
          </div>
          <div className="form-group">
            <label>Город:</label>
            <input
              type="text"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({
                ...shippingAddress,
                city: e.target.value
              })}
              required
            />
          </div>
          <div className="form-group">
            <label>Почтовый индекс:</label>
            <input
              type="text"
              value={shippingAddress.postal_code}
              onChange={(e) => setShippingAddress({
                ...shippingAddress,
                postal_code: e.target.value
              })}
              required
            />
          </div>
          <div className="form-group">
            <p>{type === 'product' ? 'Товар' : 'Услуга'}: {item.name}</p>
            {type === 'product' && (
              <>
                <p>Цена: {item.price} руб.</p>
                <div className="quantity-group">
                  <label>Количество:</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    required
                  />
                </div>
              </>
            )}
            {type === 'service' && (
              <p>Цена: по договоренности</p>
            )}
          </div>
          {type === 'product' && availablePromotions.length > 0 && (
            <div className="form-group">
              <label>Доступные скидки:</label>
              <select
                value={selectedPromotion?.id || ''}
                onChange={(e) => {
                  const promotion = availablePromotions.find(p => p.id === Number(e.target.value));
                  setSelectedPromotion(promotion);
                }}
              >
                <option value="">Без скидки</option>
                {availablePromotions.map(promotion => (
                  <option key={promotion.id} value={promotion.id}>
                    {promotion.name} ({promotion.discount_percent}%)
                  </option>
                ))}
              </select>
            </div>
          )}
          {type === 'product' && (
            <div className="price-summary">
              <p>Сумма: {item.price * quantity} ₽</p>
              {selectedPromotion && (
                <p>Скидка: {selectedPromotion.discount_percent}%</p>
              )}
              <p className="total">Итого: {calculateTotal()} ₽</p>
            </div>
          )}
          <div className="modal-buttons">
            <button type="submit" style={{
              marginTop: '10px',
              padding: '5px 10px',
              background: '#1e0397',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}>
              Подтвердить
            </button>
            <button type="button" onClick={onClose} style={{
              marginTop: '10px',
              padding: '5px 10px',
              background: '#1e0397',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal; 