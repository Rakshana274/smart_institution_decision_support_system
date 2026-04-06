import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../data/store';
import HomePage from '../pages/HomePage';

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: /Smart Institutional/i })).toBeInTheDocument();
  });
});
