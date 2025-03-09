import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ProgressBar, FAB, Portal, Modal, Button, TextInput } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../store';
import { BudgetCategory, addCategory, updateCategory, deleteCategory } from '../store/slices/budgetSlice';
import { Transaction } from '../store/slices/transactionSlice';

const BudgetScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');

  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.budget.categories);
  const transactions = useAppSelector(state => state.transactions.transactions);

  useEffect(() => {
    calculateSpentAmounts();
  }, [transactions]);

  const calculateSpentAmounts = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    categories.forEach(category => {
      const spent = transactions
        .filter(t => 
          t.type === 'expense' &&
          t.category === category.name &&
          new Date(t.date).getMonth() === currentMonth &&
          new Date(t.date).getFullYear() === currentYear
        )
        .reduce((total, t) => total + t.amount, 0);

      if (spent !== category.spent) {
        dispatch(updateCategory({ ...category, spent }));
      }
    });
  };

  const handleAddCategory = () => {
    const newCategory: BudgetCategory = {
      id: Date.now().toString(),
      name: categoryName,
      limit: parseFloat(budgetLimit),
      spent: 0,
      color: getRandomColor(),
    };
    dispatch(addCategory(newCategory));
    resetForm();
  };

  const handleUpdateCategory = () => {
    if (selectedCategory) {
      const updatedCategory: BudgetCategory = {
        ...selectedCategory,
        name: categoryName,
        limit: parseFloat(budgetLimit),
      };
      dispatch(updateCategory(updatedCategory));
      resetForm();
    }
  };

  const handleDeleteCategory = (id: string) => {
    dispatch(deleteCategory(id));
  };

  const resetForm = () => {
    setIsModalVisible(false);
    setSelectedCategory(null);
    setCategoryName('');
    setBudgetLimit('');
  };

  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#D4A5A5', '#FFE66D'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderBudgetCard = (category: BudgetCategory) => {
    const progress = category.spent / category.limit;
    const isOverBudget = progress > 1;

    return (
      <Card key={category.id} style={styles.budgetCard}>
        <Card.Content>
          <View style={styles.budgetHeader}>
            <View>
              <Text variant="titleMedium">{category.name}</Text>
              <Text variant="bodySmall" style={styles.limitText}>
                Budget: ${category.limit.toFixed(2)}
              </Text>
            </View>
            <View style={styles.budgetActions}>
              <Button
                icon="pencil"
                mode="text"
                onPress={() => {
                  setSelectedCategory(category);
                  setCategoryName(category.name);
                  setBudgetLimit(category.limit.toString());
                  setIsModalVisible(true);
                }}
              />
              <Button
                icon="delete"
                mode="text"
                onPress={() => handleDeleteCategory(category.id)}
              />
            </View>
          </View>

          <ProgressBar
            progress={Math.min(progress, 1)}
            color={isOverBudget ? '#F44336' : category.color}
            style={styles.progressBar}
          />

          <View style={styles.budgetDetails}>
            <Text variant="bodyMedium">
              Spent: ${category.spent.toFixed(2)}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: isOverBudget ? '#F44336' : '#4CAF50' }}
            >
              {isOverBudget
                ? `Over by $${(category.spent - category.limit).toFixed(2)}`
                : `Remaining: $${(category.limit - category.spent).toFixed(2)}`}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text variant="headlineSmall" style={styles.title}>Monthly Budgets</Text>
        {categories.map(renderBudgetCard)}
      </ScrollView>

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={resetForm}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Title
              title={selectedCategory ? "Edit Budget Category" : "Add Budget Category"}
            />
            <Card.Content>
              <TextInput
                label="Category Name"
                value={categoryName}
                onChangeText={setCategoryName}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Monthly Budget Limit"
                value={budgetLimit}
                onChangeText={setBudgetLimit}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />
              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={resetForm}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={selectedCategory ? handleUpdateCategory : handleAddCategory}
                  style={styles.modalButton}
                >
                  {selectedCategory ? "Update" : "Add"}
                </Button>
              </View>
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  budgetCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetActions: {
    flexDirection: 'row',
  },
  limitText: {
    color: '#666',
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
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
  input: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    marginLeft: 8,
  },
});

export default BudgetScreen;
