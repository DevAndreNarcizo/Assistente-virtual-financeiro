import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import MoreScreen from '../screens/MoreScreen';
import FinancialDiagnosisScreen from '../screens/FinancialDiagnosisScreen';
import PlanningScreen from '../screens/PlanningScreen';
import InvestmentsScreen from '../screens/InvestmentsScreen';
import EducationScreen from '../screens/EducationScreen';
import DebtControlScreen from '../screens/DebtControlScreen';

const Stack = createStackNavigator();

export const MoreStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="MoreMenu" 
        component={MoreScreen}
        options={{ title: 'More Options' }}
      />
      <Stack.Screen 
        name="FinancialDiagnosis" 
        component={FinancialDiagnosisScreen}
        options={{ title: 'Financial Diagnosis' }}
      />
      <Stack.Screen 
        name="Planning" 
        component={PlanningScreen}
        options={{ title: 'Planning' }}
      />
      <Stack.Screen 
        name="Investments" 
        component={InvestmentsScreen}
        options={{ title: 'Investments' }}
      />
      <Stack.Screen 
        name="Education" 
        component={EducationScreen}
        options={{ title: 'Financial Education' }}
      />
      <Stack.Screen 
        name="DebtControl" 
        component={DebtControlScreen}
        options={{ title: 'Debt Control' }}
      />
    </Stack.Navigator>
  );
};

export default MoreStackNavigator;
