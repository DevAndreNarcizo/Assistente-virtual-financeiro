import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EducationalResource {
  id: string;
  title: string;
  category: 'basics' | 'investing' | 'budgeting' | 'debt' | 'saving' | 'taxes' | 'retirement';
  content: string;
  isCompleted: boolean;
  timeToRead: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface EducationState {
  resources: EducationalResource[];
  loading: boolean;
  error: string | null;
}

const initialState: EducationState = {
  resources: [
    {
      id: '1',
      title: 'Understanding Personal Finance Basics',
      category: 'basics',
      content: 'Personal finance is about managing your money and achieving your financial goals. Key areas include budgeting, saving, investing, and managing debt.',
      isCompleted: false,
      timeToRead: 5,
      difficulty: 'beginner'
    },
    {
      id: '2',
      title: 'Introduction to Budgeting',
      category: 'budgeting',
      content: 'A budget is a financial plan that helps you track income and expenses. Learn how to create and maintain a budget that works for you.',
      isCompleted: false,
      timeToRead: 8,
      difficulty: 'beginner'
    },
    {
      id: '3',
      title: 'Smart Saving Strategies',
      category: 'saving',
      content: 'Discover effective strategies for saving money, including emergency funds, automated savings, and goal-based saving plans.',
      isCompleted: false,
      timeToRead: 6,
      difficulty: 'beginner'
    },
    {
      id: '4',
      title: 'Investment Fundamentals',
      category: 'investing',
      content: 'Learn the basics of investing, including different investment types, risk management, and building a diversified portfolio.',
      isCompleted: false,
      timeToRead: 10,
      difficulty: 'intermediate'
    },
    {
      id: '5',
      title: 'Managing and Reducing Debt',
      category: 'debt',
      content: 'Understand different types of debt and strategies for managing and reducing it effectively.',
      isCompleted: false,
      timeToRead: 7,
      difficulty: 'intermediate'
    }
  ],
  loading: false,
  error: null
};

const educationSlice = createSlice({
  name: 'education',
  initialState,
  reducers: {
    addResource: (state, action: PayloadAction<EducationalResource>) => {
      state.resources.push(action.payload);
    },
    updateResource: (state, action: PayloadAction<EducationalResource>) => {
      const index = state.resources.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.resources[index] = action.payload;
      }
    },
    deleteResource: (state, action: PayloadAction<string>) => {
      state.resources = state.resources.filter(r => r.id !== action.payload);
    },
    toggleResourceCompletion: (state, action: PayloadAction<string>) => {
      const resource = state.resources.find(r => r.id === action.payload);
      if (resource) {
        resource.isCompleted = !resource.isCompleted;
      }
    }
  }
});

export const {
  addResource,
  updateResource,
  deleteResource,
  toggleResourceCompletion
} = educationSlice.actions;

export default educationSlice.reducer;
