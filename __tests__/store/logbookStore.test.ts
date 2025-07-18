import { renderHook, act } from '@testing-library/react-native';
import { useLogbookStore } from '../../store/logbookStore';

describe('LogbookStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useLogbookStore());
    act(() => {
      result.current.resetStore();
    });
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useLogbookStore());
    
    expect(result.current.currentStatus).toBe('Off Duty');
    expect(result.current.hoursRemaining).toBe(11);
    expect(result.current.entries).toHaveLength(0);
  });

  it('updates status correctly', () => {
    const { result } = renderHook(() => useLogbookStore());
    
    act(() => {
      result.current.updateStatus('On Duty');
    });
    
    expect(result.current.currentStatus).toBe('On Duty');
    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].status).toBe('On Duty');
  });

  it('calculates hours remaining correctly', () => {
    const { result } = renderHook(() => useLogbookStore());
    
    act(() => {
      result.current.updateStatus('Driving');
    });
    
    // Simulate time passing
    act(() => {
      result.current.addDrivingTime(2); // 2 hours of driving
    });
    
    expect(result.current.hoursRemaining).toBe(9); // 11 - 2 = 9
  });

  it('prevents violations', () => {
    const { result } = renderHook(() => useLogbookStore());
    
    act(() => {
      result.current.addDrivingTime(11); // Exceed limit
    });
    
    expect(result.current.hasViolation).toBe(true);
    expect(result.current.violationType).toBe('driving_limit_exceeded');
  });
});