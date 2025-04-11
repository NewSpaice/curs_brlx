import { render, screen, fireEvent } from '@testing-library/react';
import Auth from '../Auth';

describe('Auth Component', () => {
  test('renders login form by default', () => {
    render(<Auth />);
    expect(screen.getByText(/Вход/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Пароль/i)).toBeInTheDocument();
  });

  test('switches to registration form', () => {
    render(<Auth />);
    fireEvent.click(screen.getByText(/Регистрация/i));
    expect(screen.getByText(/Зарегистрироваться/i)).toBeInTheDocument();
  });
}); 