import React, { useState, useEffect } from 'react';
import OrderModal from './OrderModal';
import './Services.css';

const Services = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/services/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке услуг');
      }

      const data = await response.json();
      setServices(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Не удалось загрузить список услуг');
      setLoading(false);
    }
  };

  const handleOrderService = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleSubmitOrder = async (orderData) => {
    try {
      const response = await fetch('http://localhost:8000/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...orderData,
          service_id: selectedService.id // добавляем ID услуги в заказ
        })
      });

      if (response.ok) {
        alert('Заявка на услугу успешно отправлена!');
        setShowModal(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при отправке заявки');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Произошла ошибка при отправке заявки');
    }
  };

  if (loading) {
    return (
      <div className="services-container">
        <div className="loading">Загрузка услуг...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="services-container">
      <h1>Наши Услуги</h1>
      <div className="services-grid">
        {services.map(service => (
          <div key={service.id} className="service-card">
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <ul className="service-features">
              {service.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button 
              className="order-button"
              onClick={() => handleOrderService(service)}
              disabled={!service.is_available}
            >
              {service.is_available ? 'Заказать услугу' : 'Услуга недоступна'}
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedService && (
        <OrderModal
          item={selectedService}
          type="service"
          onSubmit={handleSubmitOrder}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Services; 