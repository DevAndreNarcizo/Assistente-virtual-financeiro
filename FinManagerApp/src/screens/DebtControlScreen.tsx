import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, FAB, Portal, Modal, Button, TextInput, SegmentedButtons } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../store';
import { DebtItem, addDebt, updateDebt, deleteDebt, updateRemainingAmount } from '../store/slices/debtSlice';

const debtTypes = [
  { label: 'Credit Card', value: 'credit_card' },
  { label: 'Loan', value: 'loan' },
  { label: 'Mortgage', value: 'mortgage' },
  { label: 'Other', value: 'other' }
];

const DebtControlScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<DebtItem | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'credit_card' as DebtItem['type'],
    totalAmount: '',
    remainingAmount: '',
    interestRate: '',
    minimumPayment: '',
    dueDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const dispatch = useAppDispatch();
  const debts = useAppSelector(state => state.debts.debts);

  const calculateTotalDebt = () => {
    return debts.reduce((total, debt) => total + debt.remainingAmount, 0);
  };

  const calculateMonthlyPayments = () => {
    return debts.reduce((total, debt) => total + debt.minimumPayment, 0);
  };

  const handleSubmit = () => {
    const debtData: DebtItem = {
      id: selectedDebt?.id || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      totalAmount: parseFloat(formData.totalAmount),
      remainingAmount: parseFloat(formData.remainingAmount),
      interestRate: parseFloat(formData.interestRate),
      minimumPayment: parseFloat(formData.minimumPayment),
      dueDate: formData.dueDate,
      notes: formData.notes
    };

    if (selectedDebt) {
      dispatch(updateDebt(debtData));
    } else {
      dispatch(addDebt(debtData));
    }

    resetForm();
  };

  const handlePayment = () => {
    if (selectedDebt && paymentAmount) {
      dispatch(updateRemainingAmount({
        id: selectedDebt.id,
        amount: parseFloat(paymentAmount)
      }));
      setIsPaymentModalVisible(false);
      setPaymentAmount('');
      setSelectedDebt(null);
    }
  };

  const resetForm = () => {
    setIsModalVisible(false);
    setSelectedDebt(null);
    setFormData({
      name: '',
      type: 'credit_card',
      totalAmount: '',
      remainingAmount: '',
      interestRate: '',
      minimumPayment: '',
      dueDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleDeleteDebt = (id: string) => {
    dispatch(deleteDebt(id));
  };

  const renderDebtCard = (debt: DebtItem) => {
    const progressPercentage = ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100;
    const dueDate = new Date(debt.dueDate);
    const isOverdue = dueDate < new Date();

    return (
      <Card key={debt.id} style={styles.debtCard}>
        <Card.Content>
          <View style={styles.debtHeader}>
            <View>
              <Text variant="titleMedium">{debt.name}</Text>
              <Text variant="bodySmall" style={styles.typeText}>
                {debt.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Text>
            </View>
            <View style={styles.debtActions}>
              <Button
                icon="pencil"
                onPress={() => {
                  setSelectedDebt(debt);
                  setFormData({
                    name: debt.name,
                    type: debt.type,
                    totalAmount: debt.totalAmount.toString(),
                    remainingAmount: debt.remainingAmount.toString(),
                    interestRate: debt.interestRate.toString(),
                    minimumPayment: debt.minimumPayment.toString(),
                    dueDate: debt.dueDate,
                    notes: debt.notes
                  });
                  setIsModalVisible(true);
                }}
              >
                Edit
              </Button>
              <Button
                icon="delete"
                onPress={() => handleDeleteDebt(debt.id)}
              >
                Delete
              </Button>
            </View>
          </View>

          <View style={styles.debtDetails}>
            <View style={styles.detailRow}>
              <Text variant="bodyMedium">Total Amount:</Text>
              <Text variant="bodyMedium">${debt.totalAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text variant="bodyMedium">Remaining:</Text>
              <Text variant="bodyMedium">${debt.remainingAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text variant="bodyMedium">Interest Rate:</Text>
              <Text variant="bodyMedium">{debt.interestRate}%</Text>
            </View>
            <View style={styles.detailRow}>
              <Text variant="bodyMedium">Minimum Payment:</Text>
              <Text variant="bodyMedium">${debt.minimumPayment.toFixed(2)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text variant="bodyMedium">Due Date:</Text>
              <Text
                variant="bodyMedium"
                style={{ color: isOverdue ? '#F44336' : '#000' }}
              >
                {debt.dueDate}
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <Text variant="bodySmall" style={styles.progressText}>
                Paid: {progressPercentage.toFixed(1)}%
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPercentage}%` }
                  ]}
                />
              </View>
            </View>

            <Button
              mode="contained"
              onPress={() => {
                setSelectedDebt(debt);
                setIsPaymentModalVisible(true);
              }}
              style={styles.paymentButton}
            >
              Make Payment
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleLarge">Debt Summary</Text>
            <View style={styles.summaryDetails}>
              <View style={styles.summaryItem}>
                <Text variant="bodyLarge">Total Debt</Text>
                <Text variant="headlineSmall" style={styles.totalDebt}>
                  ${calculateTotalDebt().toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="bodyLarge">Monthly Payments</Text>
                <Text variant="headlineSmall" style={styles.monthlyPayments}>
                  ${calculateMonthlyPayments().toFixed(2)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {debts.map(renderDebtCard)}
      </ScrollView>

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={resetForm}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Title
              title={selectedDebt ? "Edit Debt" : "Add Debt"}
            />
            <Card.Content>
              <TextInput
                label="Debt Name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                mode="outlined"
                style={styles.input}
              />

              <SegmentedButtons
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as DebtItem['type'] })}
                buttons={debtTypes}
                style={styles.segmentedButtons}
              />

              <TextInput
                label="Total Amount"
                value={formData.totalAmount}
                onChangeText={(text) => setFormData({ ...formData, totalAmount: text })}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Remaining Amount"
                value={formData.remainingAmount}
                onChangeText={(text) => setFormData({ ...formData, remainingAmount: text })}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Interest Rate (%)"
                value={formData.interestRate}
                onChangeText={(text) => setFormData({ ...formData, interestRate: text })}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Minimum Payment"
                value={formData.minimumPayment}
                onChangeText={(text) => setFormData({ ...formData, minimumPayment: text })}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Due Date"
                value={formData.dueDate}
                onChangeText={(text) => setFormData({ ...formData, dueDate: text })}
                mode="outlined"
                style={styles.input}
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
                  {selectedDebt ? "Update" : "Add"}
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>

        <Modal
          visible={isPaymentModalVisible}
          onDismiss={() => {
            setIsPaymentModalVisible(false);
            setPaymentAmount('');
            setSelectedDebt(null);
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Title title="Make Payment" />
            <Card.Content>
              <TextInput
                label="Payment Amount"
                value={paymentAmount}
                onChangeText={setPaymentAmount}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />
              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setIsPaymentModalVisible(false);
                    setPaymentAmount('');
                    setSelectedDebt(null);
                  }}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handlePayment}
                  style={styles.modalButton}
                >
                  Submit Payment
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
  totalDebt: {
    color: '#F44336',
    marginTop: 4,
  },
  monthlyPayments: {
    color: '#007AFF',
    marginTop: 4,
  },
  debtCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  debtHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeText: {
    color: '#666',
    marginTop: 4,
  },
  debtActions: {
    flexDirection: 'row',
  },
  debtDetails: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 12,
    marginBottom: 16,
  },
  progressText: {
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  paymentButton: {
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

export default DebtControlScreen;
