import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StatusCard from '../../components/StatusCard';

describe('StatusCard', () => {
  const mockProps = {
    status: 'On Duty' as const,
    hoursRemaining: 8.5,
    nextBreakIn: 2.5,
    onStatusChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders status information correctly', () => {
    const { getByText } = render(<StatusCard {...mockProps} />);
    
    expect(getByText('On Duty')).toBeTruthy();
    expect(getByText('8.5h remaining')).toBeTruthy();
    expect(getByText('Next break in 2.5h')).toBeTruthy();
  });

  it('calls onStatusChange when pressed', () => {
    const { getByTestId } = render(<StatusCard {...mockProps} />);
    
    const statusCard = getByTestId('status-card');
    fireEvent.press(statusCard);
    
    expect(mockProps.onStatusChange).toHaveBeenCalledTimes(1);
  });

  it('shows warning when hours remaining is low', () => {
    const lowHoursProps = { ...mockProps, hoursRemaining: 1.0 };
    const { getByTestId } = render(<StatusCard {...lowHoursProps} />);
    
    const statusCard = getByTestId('status-card');
    expect(statusCard.props.style).toContainEqual(
      expect.objectContaining({ borderColor: expect.any(String) })
    );
  });
});