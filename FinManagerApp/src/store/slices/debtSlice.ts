import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DebtItem {
  id: string;
  name: string;
  type: 'credit_card' | 'loan' | 'mortgage' | 'other';
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: string;
  notes: string;
}

interface DebtState {
  debts: DebtItem[];
  loading: boolean;
  error: string | null;
}

const initialState: DebtState = {
  debts: [],
  loading: false,
  error: null
};

const debtSlice = createSlice({
  name: 'debts',
  initialState,
  reducers: {
    addDebt: (state, action: PayloadAction<DebtItem>) => {
      state.debts.push(action.payload);
    },
    updateDebt: (state, action: PayloadAction<DebtItem>) => {
      const index = state.debts.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.debts[index] = action.payload;
      }
    },
    deleteDebt: (state, action: PayloadAction<string>) => {
      state.debts = state.debts.filter(d => d.id !== action.payload);
    },
    updateRemainingAmount: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const debt = state.debts.find(d => d.id === action.payload.id);
      if (debt) {
        debt.remainingAmount = Math.max(0, debt.remainingAmount - action.payload.amount);
      }
    }
  }
});

export const {
  addDebt,
  updateDebt,
  deleteDebt,
  updateRemainingAmount
} = debtSlice.actions;

export default debtSlice.reducer;
