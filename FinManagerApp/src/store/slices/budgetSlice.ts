import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
}

interface BudgetState {
  categories: BudgetCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  categories: [
    {
      id: '1',
      name: 'Food',
      limit: 500,
      spent: 0,
      color: '#FF6B6B'
    },
    {
      id: '2',
      name: 'Transportation',
      limit: 300,
      spent: 0,
      color: '#4ECDC4'
    },
    {
      id: '3',
      name: 'Entertainment',
      limit: 200,
      spent: 0,
      color: '#45B7D1'
    },
    {
      id: '4',
      name: 'Shopping',
      limit: 400,
      spent: 0,
      color: '#96CEB4'
    },
    {
      id: '5',
      name: 'Utilities',
      limit: 300,
      spent: 0,
      color: '#D4A5A5'
    }
  ],
  loading: false,
  error: null
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<BudgetCategory>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<BudgetCategory>) => {
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(c => c.id !== action.payload);
    },
    updateSpentAmount: (state, action: PayloadAction<{ categoryId: string; amount: number }>) => {
      const category = state.categories.find(c => c.id === action.payload.categoryId);
      if (category) {
        category.spent = action.payload.amount;
      }
    }
  }
});

export const {
  addCategory,
  updateCategory,
  deleteCategory,
  updateSpentAmount
} = budgetSlice.actions;

export default budgetSlice.reducer;
