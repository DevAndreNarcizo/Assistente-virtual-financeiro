import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import transactionReducer from './slices/transactionSlice';
import budgetReducer from './slices/budgetSlice';
import investmentReducer from './slices/investmentSlice';
import debtReducer from './slices/debtSlice';
import planningReducer from './slices/planningSlice';
import educationReducer from './slices/educationSlice';

// Create the store
export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    budget: budgetReducer,
    investments: investmentReducer,
    debts: debtReducer,
    planning: planningReducer,
    education: educationReducer,
  },
});

// Export types for TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
