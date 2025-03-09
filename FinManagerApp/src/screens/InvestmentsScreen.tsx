import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, FAB, Portal, Modal, Button, TextInput, SegmentedButtons } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../store';
import { Investment, addInvestment, updateInvestment, deleteInvestment } from '../store/slices/investmentSlice';

const investmentTypes = [
  { value: 'stock', label: 'Stock' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'mutual_fund', label: 'Mutual Fund' },
  { value: 'bond', label: 'Bond' },
  { value: 'other', label: 'Other' }
];

const InvestmentsScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'stock' as Investment['type'],
    amount: '',
    quantity: '',
    purchasePrice: '',
    currentPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const dispatch = useAppDispatch();
  const investments = useAppSelector(state => state.investments.investments);

  const calculateTotalValue = () => {
    return investments.reduce((total, investment) => {
      return total + (investment.quantity * investment.currentPrice);
    }, 0);
  };

  const calculateTotalGainLoss = () => {
    return investments.reduce((total, investment) => {
      const gainLoss = (investment.currentPrice - investment.purchasePrice) * investment.quantity;
      return total + gainLoss;
    }, 0);
  };

  const calculateInvestmentReturn = (investment: Investment) => {
    const gainLoss = (investment.currentPrice - investment.purchasePrice) * investment.quantity;
    const percentageReturn = ((investment.currentPrice - investment.purchasePrice) / investment.purchasePrice) * 100;
    return {
      gainLoss,
      percentageReturn
    };
  };

  const handleSubmit = () => {
    const investmentData: Investment = {
      id: selectedInvestment?.id || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      amount: parseFloat(formData.amount),
      quantity: parseFloat(formData.quantity),
      purchasePrice: parseFloat(formData.purchasePrice),
      currentPrice: parseFloat(formData.currentPrice),
      purchaseDate: formData.purchaseDate,
      notes: formData.notes
    };

    if (selectedInvestment) {
      dispatch(updateInvestment(investmentData));
    } else {
      dispatch(addInvestment(investmentData));
    }

    resetForm();
  };

  const resetForm = () => {
    setIsModalVisible(false);
    setSelectedInvestment(null);
    setFormData({
      name: '',
      type: 'stock',
      amount: '',
      quantity: '',
      purchasePrice: '',
      currentPrice: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleDeleteInvestment = (id: string) => {
    dispatch(deleteInvestment(id));
  };

  const renderInvestmentCard = (investment: Investment) => {
    const { gainLoss, percentageReturn } = calculateInvestmentReturn(investment);
    const isPositive = gainLoss >= 0;

    return (
      <Card key={investment.id} style={styles.investmentCard}>
        <Card.Content>
          <View style={styles.investmentHeader}>
            <View>
              <Text variant="titleMedium">{investment.name}</Text>
              <Text variant="bodySmall" style={styles.typeText}>
                {investment.type.charAt(0).toUpperCase() + investment.type.slice(1)}
              </Text>
            </View>
            <View style={styles.investmentActions}>
              <Button
                icon="pencil"
                onPress={() => {
                  setSelectedInvestment(investment);
                  setFormData({
                    name: investment.name,
                    type: investment.type,
                    amount: investment.amount.toString(),
                    quantity: investment.quantity.toString(),
                    purchasePrice: investment.purchasePrice.toString(),
                    currentPrice: investment.currentPrice.toString(),
                    purchaseDate: investment.purchaseDate,
                    notes: investment.notes
                  });
                  setIsModalVisible(true);
                }}
              >
                Edit
              </Button>
              <Button
                icon="delete"
                onPress={() => handleDeleteInvestment(investment.id)}
              >
                Delete
              </Button>
            </View>
          </View>

          <View style={styles.investmentDetails}>
            <View style={styles.detailRow}>
              <Text variant="bodyMedium">Quantity:</Text>
              <Text variant="bodyMedium">{investment.quantity}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text variant="bodyMedium">Purchase Price:</Text>
              <Text variant="bodyMedium">${investment.purchasePrice.toFixed(2)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text variant="bodyMedium">Current Price:</Text>
              <Text variant="bodyMedium">${investment.currentPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text variant="bodyMedium">Total Value:</Text>
              <Text variant="bodyMedium">
                ${(investment.quantity * investment.currentPrice).toFixed(2)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text variant="bodyMedium">Gain/Loss:</Text>
              <Text
                variant="bodyMedium"
                style={{ color: isPositive ? '#4CAF50' : '#F44336' }}
              >
                {isPositive ? '+' : '-'}${Math.abs(gainLoss).toFixed(2)} ({percentageReturn.toFixed(2)}%)
              </Text>
            </View>
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
            <Text variant="titleLarge">Portfolio Summary</Text>
            <View style={styles.summaryDetails}>
              <View style={styles.summaryItem}>
                <Text variant="bodyLarge">Total Value</Text>
                <Text variant="headlineSmall" style={styles.totalValue}>
                  ${calculateTotalValue().toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="bodyLarge">Total Gain/Loss</Text>
                <Text
                  variant="headlineSmall"
                  style={{
                    color: calculateTotalGainLoss() >= 0 ? '#4CAF50' : '#F44336'
                  }}
                >
                  {calculateTotalGainLoss() >= 0 ? '+' : '-'}$
                  {Math.abs(calculateTotalGainLoss()).toFixed(2)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {investments.map(renderInvestmentCard)}
      </ScrollView>

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={resetForm}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Title
              title={selectedInvestment ? "Edit Investment" : "Add Investment"}
            />
            <Card.Content>
              <TextInput
                label="Investment Name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                mode="outlined"
                style={styles.input}
              />

              <SegmentedButtons
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as Investment['type'] })}
                buttons={investmentTypes}
                style={styles.segmentedButtons}
              />

              <TextInput
                label="Quantity"
                value={formData.quantity}
                onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Purchase Price"
                value={formData.purchasePrice}
                onChangeText={(text) => setFormData({ ...formData, purchasePrice: text })}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Current Price"
                value={formData.currentPrice}
                onChangeText={(text) => setFormData({ ...formData, currentPrice: text })}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Purchase Date"
                value={formData.purchaseDate}
                onChangeText={(text) => setFormData({ ...formData, purchaseDate: text })}
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
                  {selectedInvestment ? "Update" : "Add"}
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
  totalValue: {
    color: '#007AFF',
    marginTop: 4,
  },
  investmentCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeText: {
    color: '#666',
    marginTop: 4,
  },
  investmentActions: {
    flexDirection: 'row',
  },
  investmentDetails: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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

export default InvestmentsScreen;
