import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Investment {
  id: string;
  name: string;
  type: 'stock' | 'crypto' | 'mutual_fund' | 'bond' | 'other';
  amount: number;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  notes: string;
}

interface InvestmentState {
  investments: Investment[];
  loading: boolean;
  error: string | null;
}

const initialState: InvestmentState = {
  investments: [],
  loading: false,
  error: null
};

const investmentSlice = createSlice({
  name: 'investments',
  initialState,
  reducers: {
    addInvestment: (state, action: PayloadAction<Investment>) => {
      state.investments.push(action.payload);
    },
    updateInvestment: (state, action: PayloadAction<Investment>) => {
      const index = state.investments.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.investments[index] = action.payload;
      }
    },
    deleteInvestment: (state, action: PayloadAction<string>) => {
      state.investments = state.investments.filter(i => i.id !== action.payload);
    },
    updateCurrentPrice: (state, action: PayloadAction<{ id: string; price: number }>) => {
      const investment = state.investments.find(i => i.id === action.payload.id);
      if (investment) {
        investment.currentPrice = action.payload.price;
      }
    }
  }
});

export const {
  addInvestment,
  updateInvestment,
  deleteInvestment,
  updateCurrentPrice
} = investmentSlice.actions;

export default investmentSlice.reducer;
