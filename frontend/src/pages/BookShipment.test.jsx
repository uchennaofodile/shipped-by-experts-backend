import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import BookShipment from './BookShipment';

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('BookShipment Component', () => {
  it('renders the heading and button', () => {
    render(
      <MemoryRouter>
        <BookShipment />
      </MemoryRouter>
    );
    expect(screen.getByText('Book New Shipment')).toBeInTheDocument();
    expect(screen.getByText('Start a new shipment request by entering your vehicle and shipping details.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /begin/i })).toBeInTheDocument();
  });

  it('navigates to vehicle-shipping-info on button click', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    render(
      <MemoryRouter>
        <BookShipment />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /begin/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/vehicle-shipping-info');
  });
});
