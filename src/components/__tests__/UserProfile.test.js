import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserProfile from '../UserProfile';

// Мок для fetch
global.fetch = jest.fn();

describe('UserProfile Component', () => {
  beforeEach(() => {
    // Очищаем моки перед каждым тестом
    fetch.mockClear();
    
    // Мокаем localStorage
    Storage.prototype.getItem = jest.fn(() => 'fake-token');
  });

  test('renders user profile', async () => {
    // Мокаем ответ API для профиля пользователя
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          email: 'test@example.com',
          first_name: 'Test'
        })
      })
    );

    // Мокаем ответ API для заказов
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    );

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText(/Личный кабинет/i)).toBeInTheDocument();
    });
  });

  test('displays orders correctly', async () => {
    // Мокаем ответ API для профиля
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          email: 'test@example.com'
        })
      })
    );

    // Мокаем ответ API для заказов
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            id: 1,
            status: 'pending',
            payment_status: 'pending',
            total_amount: 100,
            items: [{ product_name: 'Test Product', quantity: 1 }]
          }
        ])
      })
    );

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
      expect(screen.getByText(/В обработке/i)).toBeInTheDocument();
    });
  });
}); 