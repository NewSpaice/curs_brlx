import React, { useState, useEffect } from 'react';
import {productService} from './productService';
import {orderService} from './orderService';
import './Catalog.css';
import OrderModal from './OrderModal';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Состояния для фильтров
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products/');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке товаров');
      }
      const data = await response.json();
      setProducts(data);
      
      // Получаем уникальные категории из товаров
      const uniqueCategories = [...new Set(data.map(product => product.category))];
      setCategories(uniqueCategories);
      
      setLoading(false);
    } catch (error) {
      setError('Не удалось загрузить товары');
      setLoading(false);
    }
  };

  // Функция фильтрации товаров
  const getFilteredProducts = () => {
    return products.filter(product => {
      // Фильтр по категории
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      
      // Фильтр по цене
      if (priceRange.min && product.price < Number(priceRange.min)) {
        return false;
      }
      if (priceRange.max && product.price > Number(priceRange.max)) {
        return false;
      }
      
      // Фильтр по поисковому запросу
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
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
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        alert('Заказ успешно создан!');
        setShowModal(false);
      } else {
        throw new Error('Ошибка при создании заказа');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Произошла ошибка при создании заказа');
    }
  };

  if (loading) {
    return <div className="loading">Загрузка товаров...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const filteredProducts = getFilteredProducts();

  return (
    <div className="catalog-container">
      <h1>Ассортимент</h1>
      
      <div className="filters-section">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">Все категории</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="price-filter">
          <input
            type="number"
            placeholder="Мин. цена"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="price-input"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Макс. цена"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="price-input"
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          Товары не найдены
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              {product.image && (
                <img src={product.image} alt={product.name} />
              )}
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-category">
                Категория: {product.category}
              </div>
              <div className="price">{product.price} ₽</div>
              <button
                className="buy-button"
                onClick={() => handleOrderClick(product)}
              >
                Заказать
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedProduct && (
        <OrderModal
          item={selectedProduct}
          type="product"
          onSubmit={handleSubmitOrder}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Catalog; 