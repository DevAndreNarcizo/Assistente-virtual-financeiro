import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, FAB, Portal, Modal, Button, TextInput, SegmentedButtons, Checkbox } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../store';
import { FinancialGoal, addGoal, updateGoal, deleteGoal, updateGoalProgress, toggleGoalCompletion } from '../store/slices/planningSlice';

const goalCategories = [
  { label: 'Savings', value: 'savings' },
  { label: 'Investment', value: 'investment' },
  { label: 'Debt Payoff', value: 'debt_payoff' },
  { label: 'Purchase', value: 'purchase' },
  { label: 'Emergency Fund', value: 'emergency_fund' },
  { label: 'Other', value: 'other' }
] as const;

const priorityLevels = [
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' }
] as const;

const PlanningScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProgressModalVisible, setIsProgressModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
  const [progressAmount, setProgressAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: new Date().toISOString().split('T')[0],
    category: 'savings' as FinancialGoal['category'],
    priority: 'medium' as FinancialGoal['priority'],
    notes: '',
  });

  const dispatch = useAppDispatch();
  const goals = useAppSelector(state => state.planning.goals);

  const calculateTotalProgress = () => {
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    return {
      total: totalTarget,
      current: totalCurrent,
      percentage: totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0
    };
  };

  const handleSubmit = () => {
    const goalData: FinancialGoal = {
      id: selectedGoal?.id || Date.now().toString(),
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      deadline: formData.deadline,
      category: formData.category,
      priority: formData.priority,
      notes: formData.notes,
      isCompleted: false
    };

    if (selectedGoal) {
      dispatch(updateGoal(goalData));
    } else {
      dispatch(addGoal(goalData));
    }

    resetForm();
  };

  const handleProgress = () => {
    if (selectedGoal && progressAmount) {
      dispatch(updateGoalProgress({
        id: selectedGoal.id,
        amount: parseFloat(progressAmount)
      }));
      setIsProgressModalVisible(false);
      setProgressAmount('');
      setSelectedGoal(null);
    }
  };

  const resetForm = () => {
    setIsModalVisible(false);
    setSelectedGoal(null);
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: new Date().toISOString().split('T')[0],
      category: 'savings',
      priority: 'medium',
      notes: ''
    });
  };

  const handleDeleteGoal = (id: string) => {
    dispatch(deleteGoal(id));
  };

  const getPriorityColor = (priority: FinancialGoal['priority']) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FFA726';
      case 'low': return '#66BB6A';
      default: return '#000000';
    }
  };

  const renderGoalCard = (goal: FinancialGoal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    const deadline = new Date(goal.deadline);
    const daysRemaining = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
      <Card key={goal.id} style={[styles.goalCard, goal.isCompleted && styles.completedGoal]}>
        <Card.Content>
          <View style={styles.goalHeader}>
            <View style={styles.goalTitleSection}>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={goal.isCompleted ? 'checked' : 'unchecked'}
                  onPress={() => dispatch(toggleGoalCompletion(goal.id))}
                />
                <Text 
                  variant="titleMedium" 
                  style={[
                    styles.goalTitle,
                    goal.isCompleted && styles.completedText
                  ]}
                >
                  {goal.name}
                </Text>
              </View>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(goal.priority) }]}>
                <Text style={styles.priorityText}>
                  {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                </Text>
              </View>
            </View>
            <View style={styles.goalActions}>
              <Button
                icon="pencil"
                onPress={() => {
                  setSelectedGoal(goal);
                  setFormData({
                    name: goal.name,
                    targetAmount: goal.targetAmount.toString(),
                    currentAmount: goal.currentAmount.toString(),
                    deadline: goal.deadline,
                    category: goal.category,
                    priority: goal.priority,
                    notes: goal.notes
                  });
                  setIsModalVisible(true);
                }}
              >
                Edit
              </Button>
              <Button
                icon="delete"
                onPress={() => handleDeleteGoal(goal.id)}
              >
                Delete
              </Button>
            </View>
          </View>

          <View style={styles.goalDetails}>
            <View style={styles.progressSection}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(progress, 100)}%` }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                ${goal.currentAmount.toFixed(2)} of ${goal.targetAmount.toFixed(2)} ({progress.toFixed(1)}%)
              </Text>
            </View>

            <View style={styles.goalInfo}>
              <Text style={styles.categoryText}>
                Category: {goal.category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Text>
              <Text style={styles.deadlineText}>
                {daysRemaining > 0 
                  ? `${daysRemaining} days remaining`
                  : 'Deadline passed'}
              </Text>
            </View>

            {!goal.isCompleted && remainingAmount > 0 && (
              <Button
                mode="contained"
                onPress={() => {
                  setSelectedGoal(goal);
                  setIsProgressModalVisible(true);
                }}
                style={styles.updateButton}
              >
                Update Progress
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const { total, current, percentage } = calculateTotalProgress();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleLarge">Goals Summary</Text>
            <View style={styles.summaryDetails}>
              <View style={styles.summaryItem}>
                <Text variant="bodyLarge">Total Target</Text>
                <Text variant="headlineSmall" style={styles.totalAmount}>
                  ${total.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="bodyLarge">Current Progress</Text>
                <Text variant="headlineSmall" style={styles.progressAmount}>
                  ${current.toFixed(2)}
                </Text>
                <Text variant="bodyMedium">
                  ({percentage.toFixed(1)}%)
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {goals.map(renderGoalCard)}
      </ScrollView>

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={resetForm}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Title
              title={selectedGoal ? "Edit Goal" : "Add Goal"}
            />
            <Card.Content>
              <TextInput
                label="Goal Name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Target Amount"
                value={formData.targetAmount}
                onChangeText={(text) => setFormData({ ...formData, targetAmount: text })}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Current Amount"
                value={formData.currentAmount}
                onChangeText={(text) => setFormData({ ...formData, currentAmount: text })}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Deadline"
                value={formData.deadline}
                onChangeText={(text) => setFormData({ ...formData, deadline: text })}
                mode="outlined"
                style={styles.input}
              />

              <Text variant="bodyMedium" style={styles.inputLabel}>Category</Text>
              <SegmentedButtons
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as FinancialGoal['category'] })}
                buttons={goalCategories}
                style={styles.segmentedButtons}
              />

              <Text variant="bodyMedium" style={styles.inputLabel}>Priority</Text>
              <SegmentedButtons
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as FinancialGoal['priority'] })}
                buttons={priorityLevels}
                style={styles.segmentedButtons}
              />

              <TextInput
                label="Notes"
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                mode="outlined"
                multiline
                numberOfLines={3}
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
                  onPress={handleSubmit}
                  style={styles.modalButton}
                >
                  {selectedGoal ? "Update" : "Add"}
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>

        <Modal
          visible={isProgressModalVisible}
          onDismiss={() => {
            setIsProgressModalVisible(false);
            setProgressAmount('');
            setSelectedGoal(null);
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Title title="Update Progress" />
            <Card.Content>
              <TextInput
                label="Progress Amount"
                value={progressAmount}
                onChangeText={setProgressAmount}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />
              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setIsProgressModalVisible(false);
                    setProgressAmount('');
                    setSelectedGoal(null);
                  }}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleProgress}
                  style={styles.modalButton}
                >
                  Update
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
  summaryCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  summaryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  totalAmount: {
    color: '#007AFF',
    marginTop: 4,
  },
  progressAmount: {
    color: '#4CAF50',
    marginTop: 4,
  },
  goalCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  completedGoal: {
    opacity: 0.7,
  },
  goalHeader: {
    marginBottom: 16,
  },
  goalTitleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTitle: {
    marginLeft: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
  },
  goalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  goalDetails: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  goalInfo: {
    marginBottom: 12,
  },
  categoryText: {
    marginBottom: 4,
  },
  deadlineText: {
    color: '#666',
  },
  updateButton: {
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
  inputLabel: {
    marginBottom: 8,
  },
  segmentedButtons: {
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

export default PlanningScreen;
