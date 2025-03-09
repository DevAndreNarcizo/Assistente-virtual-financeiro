import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { store } from './src/store';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import BudgetScreen from './src/screens/BudgetScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MoreStackNavigator from './src/navigation/MoreStackNavigator';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                switch (route.name) {
                  case 'Home':
                    iconName = focused ? 'home' : 'home-outline';
                    break;
                  case 'Transactions':
                    iconName = focused ? 'list' : 'list-outline';
                    break;
                  case 'Budget':
                    iconName = focused ? 'pie-chart' : 'pie-chart-outline';
                    break;
                  case 'Profile':
                    iconName = focused ? 'person' : 'person-outline';
                    break;
                  case 'More':
                    iconName = focused ? 'menu' : 'menu-outline';
                    break;
                  default:
                    iconName = 'help-outline';
                }

                return <Ionicons name={iconName as any} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#007AFF',
              tabBarInactiveTintColor: 'gray',
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Transactions" component={TransactionsScreen} />
            <Tab.Screen name="Budget" component={BudgetScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen 
              name="More" 
              component={MoreStackNavigator}
              options={{
                headerShown: false
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  );
}
