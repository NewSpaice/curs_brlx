import { render, screen } from '@testing-library/react';
import Catalog from '../Catalog';

describe('Catalog Component', () => {
  test('shows loading state', () => {
    render(<Catalog />);
    expect(screen.getByText(/Загрузка товаров/i)).toBeInTheDocument();
  });

 
}); 