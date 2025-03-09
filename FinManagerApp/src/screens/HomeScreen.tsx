import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useAppSelector } from '../store';
import { Transaction } from '../store/slices/transactionSlice';

const HomeScreen = () => {
  const transactions = useAppSelector(state => state.transactions.transactions);

  const calculateTotalBalance = () => {
    return transactions.reduce((total, transaction) => {
      return total + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
    }, 0);
  };

  const calculateMonthlyIncome = () => {
    const currentMonth = new Date().getMonth();
    return transactions
      .filter(t => t.type === 'income' && new Date(t.date).getMonth() === currentMonth)
      .reduce((total, t) => total + t.amount, 0);
  };

  const calculateMonthlyExpenses = () => {
    const currentMonth = new Date().getMonth();
    return transactions
      .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth)
      .reduce((total, t) => total + t.amount, 0);
  };

  const getRecentTransactions = () => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  const renderTransactionItem = (transaction: Transaction) => (
    <Card key={transaction.id} style={styles.transactionItem}>
      <Card.Content style={styles.transactionContent}>
        <View style={styles.transactionLeft}>
          <Text variant="titleMedium">{transaction.description}</Text>
          <Text variant="bodySmall" style={styles.categoryText}>
            {transaction.category}
          </Text>
        </View>
        <Text
          variant="titleMedium"
          style={[
            styles.amount,
            { color: transaction.type === 'income' ? '#4CAF50' : '#F44336' }
          ]}
        >
          {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.balanceCard}>
        <Card.Content>
          <Text variant="titleLarge">Total Balance</Text>
          <Text variant="displaySmall" style={styles.balanceAmount}>
            ${calculateTotalBalance().toFixed(2)}
          </Text>
        </Card.Content>
      </Card>
      
      <View style={styles.summaryContainer}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleMedium">Income</Text>
            <Text variant="titleLarge" style={styles.incomeText}>
              +${calculateMonthlyIncome().toFixed(2)}
            </Text>
            <Text variant="bodySmall" style={styles.monthLabel}>This Month</Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleMedium">Expenses</Text>
            <Text variant="titleLarge" style={styles.expenseText}>
              -${calculateMonthlyExpenses().toFixed(2)}
            </Text>
            <Text variant="bodySmall" style={styles.monthLabel}>This Month</Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.recentTransactionsSection}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Recent Transactions
        </Text>
        {getRecentTransactions().map(renderTransactionItem)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  balanceCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  balanceAmount: {
    marginTop: 8,
    color: '#007AFF',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#fff',
  },
  incomeText: {
    color: '#4CAF50',
    marginTop: 4,
  },
  expenseText: {
    color: '#F44336',
    marginTop: 4,
  },
  monthLabel: {
    color: '#666',
    marginTop: 4,
  },
  recentTransactionsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  transactionItem: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flex: 1,
  },
  categoryText: {
    color: '#666',
    marginTop: 4,
  },
  amount: {
    fontWeight: 'bold',
  },
});

export default HomeScreen;
