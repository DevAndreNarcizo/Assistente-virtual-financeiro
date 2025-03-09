import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../store';

const MoreScreen = () => {
  const navigation = useNavigation();
  const goals = useAppSelector(state => state.planning.goals);
  const debts = useAppSelector(state => state.debts.debts);
  const investments = useAppSelector(state => state.investments.investments);
  const educationResources = useAppSelector(state => state.education.resources);

  const getCompletedEducationCount = () => {
    return educationResources.filter(r => r.isCompleted).length;
  };

  const getActiveGoalsCount = () => {
    return goals.filter(g => !g.isCompleted).length;
  };

  const getTotalInvestments = () => {
    return investments.reduce((total, inv) => total + (inv.quantity * inv.currentPrice), 0);
  };

  const getTotalDebt = () => {
    return debts.reduce((total, debt) => total + debt.remainingAmount, 0);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.summaryTitle}>Quick Overview</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text variant="titleLarge">{getActiveGoalsCount()}</Text>
              <Text variant="bodySmall">Active Goals</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="titleLarge">${getTotalInvestments().toFixed(0)}</Text>
              <Text variant="bodySmall">Investments</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="titleLarge">${getTotalDebt().toFixed(0)}</Text>
              <Text variant="bodySmall">Total Debt</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="titleLarge">{getCompletedEducationCount()}</Text>
              <Text variant="bodySmall">Topics Learned</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <List.Section>
        <List.Subheader>Financial Tools</List.Subheader>
        
        <List.Item
          title="Financial Diagnosis"
          description="Get insights about your financial health"
          left={props => <List.Icon {...props} icon="chart-line" />}
          onPress={() => navigation.navigate('FinancialDiagnosis' as never)}
          style={styles.listItem}
        />
        
        <List.Item
          title="Planning"
          description={`${getActiveGoalsCount()} active financial goals`}
          left={props => <List.Icon {...props} icon="flag" />}
          onPress={() => navigation.navigate('Planning' as never)}
          style={styles.listItem}
        />
        
        <List.Item
          title="Investments"
          description={`Portfolio value: $${getTotalInvestments().toFixed(2)}`}
          left={props => <List.Icon {...props} icon="trending-up" />}
          onPress={() => navigation.navigate('Investments' as never)}
          style={styles.listItem}
        />
        
        <List.Item
          title="Debt Control"
          description={`Total debt: $${getTotalDebt().toFixed(2)}`}
          left={props => <List.Icon {...props} icon="credit-card" />}
          onPress={() => navigation.navigate('DebtControl' as never)}
          style={styles.listItem}
        />
        
        <List.Item
          title="Financial Education"
          description={`${getCompletedEducationCount()} topics completed`}
          left={props => <List.Icon {...props} icon="school" />}
          onPress={() => navigation.navigate('Education' as never)}
          style={styles.listItem}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Additional Resources</List.Subheader>
        
        <List.Item
          title="Help & Support"
          description="Get assistance with the app"
          left={props => <List.Icon {...props} icon="help-circle" />}
          onPress={() => {/* Implement help functionality */}}
          style={styles.listItem}
        />
        
        <List.Item
          title="About"
          description="Learn more about the app"
          left={props => <List.Icon {...props} icon="information" />}
          onPress={() => {/* Implement about functionality */}}
          style={styles.listItem}
        />
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    margin: 16,
    backgroundColor: '#fff',
  },
  summaryTitle: {
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  listItem: {
    backgroundColor: '#fff',
  },
});

export default MoreScreen;
