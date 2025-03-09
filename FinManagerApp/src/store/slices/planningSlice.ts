import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'savings' | 'investment' | 'debt_payoff' | 'purchase' | 'emergency_fund' | 'other';
  priority: 'high' | 'medium' | 'low';
  notes: string;
  isCompleted: boolean;
}

interface PlanningState {
  goals: FinancialGoal[];
  loading: boolean;
  error: string | null;
}

const initialState: PlanningState = {
  goals: [],
  loading: false,
  error: null
};

const planningSlice = createSlice({
  name: 'planning',
  initialState,
  reducers: {
    addGoal: (state, action: PayloadAction<FinancialGoal>) => {
      state.goals.push(action.payload);
    },
    updateGoal: (state, action: PayloadAction<FinancialGoal>) => {
      const index = state.goals.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.goals[index] = action.payload;
      }
    },
    deleteGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter(g => g.id !== action.payload);
    },
    updateGoalProgress: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const goal = state.goals.find(g => g.id === action.payload.id);
      if (goal) {
        goal.currentAmount = Math.min(goal.currentAmount + action.payload.amount, goal.targetAmount);
        goal.isCompleted = goal.currentAmount >= goal.targetAmount;
      }
    },
    toggleGoalCompletion: (state, action: PayloadAction<string>) => {
      const goal = state.goals.find(g => g.id === action.payload);
      if (goal) {
        goal.isCompleted = !goal.isCompleted;
      }
    }
  }
});

export const {
  addGoal,
  updateGoal,
  deleteGoal,
  updateGoalProgress,
  toggleGoalCompletion
} = planningSlice.actions;

export default planningSlice.reducer;
