import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Receipt, ReceiptType } from '@/types';
import { mockReceipts } from '@/constants/mockData';

interface ReceiptState {
  receipts: Receipt[];
  isScanning: boolean;
  
  // Actions
  addReceipt: (receipt: Receipt) => void;
  deleteReceipt: (id: string) => void;
  updateReceipt: (id: string, updates: Partial<Receipt>) => void;
  startScanning: () => void;
  stopScanning: () => void;
  getReceiptsByType: (type: ReceiptType) => Receipt[];
  getTotalByCategory: (category: string) => number;
}

export const useReceiptStore = create<ReceiptState>()(
  persist(
    (set, get) => ({
      receipts: mockReceipts,
      isScanning: false,
      
      addReceipt: (receipt) => set((state) => ({
        receipts: [receipt, ...state.receipts],
      })),
      
      deleteReceipt: (id) => set((state) => ({
        receipts: state.receipts.filter((receipt) => receipt.id !== id),
      })),
      
      updateReceipt: (id, updates) => set((state) => ({
        receipts: state.receipts.map((receipt) => 
          receipt.id === id ? { ...receipt, ...updates } : receipt
        ),
      })),
      
      startScanning: () => set({ isScanning: true }),
      
      stopScanning: () => set({ isScanning: false }),
      
      getReceiptsByType: (type) => {
        return get().receipts.filter((receipt) => receipt.type === type);
      },
      
      getTotalByCategory: (category) => {
        return get().receipts
          .filter((receipt) => receipt.category === category)
          .reduce((sum, receipt) => sum + receipt.amount, 0);
      },
    }),
    {
      name: 'receipt-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);