import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, FAB, Portal, Modal, IconButton } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../store';
import { Transaction, addTransaction, updateTransaction, deleteTransaction } from '../store/slices/transactionSlice';
import TransactionForm from '../components/TransactionForm';

const TransactionsScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(state => state.transactions.transactions);

  const handleAddTransaction = (values: Partial<Transaction>) => {
    const newTransaction: Transaction = {
      ...values as Transaction,
      id: Date.now().toString(),
    };
    dispatch(addTransaction(newTransaction));
    setIsModalVisible(false);
  };

  const handleUpdateTransaction = (values: Partial<Transaction>) => {
    if (selectedTransaction) {
      const updatedTransaction: Transaction = {
        ...selectedTransaction,
        ...values,
      };
      dispatch(updateTransaction(updatedTransaction));
      setSelectedTransaction(null);
      setIsModalVisible(false);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    dispatch(deleteTransaction(id));
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <Card style={styles.transactionCard}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.transactionInfo}>
          <Text variant="titleMedium">{item.description}</Text>
          <Text variant="bodyMedium" style={styles.category}>{item.category}</Text>
          <Text variant="bodySmall" style={styles.date}>{item.date}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text
            variant="titleMedium"
            style={[
              styles.amount,
              { color: item.type === 'income' ? '#4CAF50' : '#F44336' }
            ]}
          >
            {item.type === 'income' ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
          </Text>
          <View style={styles.actionButtons}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => {
                setSelectedTransaction(item);
                setIsModalVisible(true);
              }}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDeleteTransaction(item.id)}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => {
            setIsModalVisible(false);
            setSelectedTransaction(null);
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Title
              title={selectedTransaction ? "Edit Transaction" : "Add Transaction"}
            />
            <Card.Content>
              <TransactionForm
                initialValues={selectedTransaction || undefined}
                onSubmit={selectedTransaction ? handleUpdateTransaction : handleAddTransaction}
                onCancel={() => {
                  setIsModalVisible(false);
                  setSelectedTransaction(null);
                }}
              />
            </Card.Content>
          </Card>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  transactionCard: {
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  category: {
    color: '#666',
    marginTop: 4,
  },
  date: {
    color: '#999',
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
  },
  modalContainer: {
    padding: 20,
  },
});

export default TransactionsScreen;
