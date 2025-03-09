import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, HelperText, Text } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Transaction } from '../store/slices/transactionSlice';

interface TransactionFormProps {
  initialValues?: Partial<Transaction>;
  onSubmit: (values: Partial<Transaction>) => void;
  onCancel: () => void;
}

const transactionCategories = {
  income: [
    'Salary',
    'Freelance',
    'Investments',
    'Other Income'
  ],
  expense: [
    'Food',
    'Transportation',
    'Housing',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Other Expenses'
  ]
};

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  type: Yup.string()
    .required('Type is required')
    .oneOf(['income', 'expense'], 'Invalid type'),
  category: Yup.string()
    .required('Category is required'),
  description: Yup.string()
    .required('Description is required')
    .min(3, 'Description must be at least 3 characters'),
  date: Yup.string()
    .required('Date is required')
});

const TransactionForm: React.FC<TransactionFormProps> = ({
  initialValues = {
    amount: '',
    type: 'expense',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  },
  onSubmit,
  onCancel
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
        <View style={styles.container}>
          <TextInput
            label="Amount"
            value={values.amount?.toString()}
            onChangeText={handleChange('amount')}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            error={touched.amount && !!errors.amount}
          />
          <HelperText type="error" visible={touched.amount && !!errors.amount}>
            {errors.amount}
          </HelperText>

          <View style={styles.typeContainer}>
            <Text variant="bodyMedium">Type:</Text>
            <View style={styles.typeButtons}>
              <Button
                mode={values.type === 'income' ? 'contained' : 'outlined'}
                onPress={() => setFieldValue('type', 'income')}
                style={[styles.typeButton, values.type === 'income' && styles.activeTypeButton]}
              >
                Income
              </Button>
              <Button
                mode={values.type === 'expense' ? 'contained' : 'outlined'}
                onPress={() => setFieldValue('type', 'expense')}
                style={[styles.typeButton, values.type === 'expense' && styles.activeTypeButton]}
              >
                Expense
              </Button>
            </View>
          </View>

          <TextInput
            label="Category"
            value={values.category}
            onChangeText={handleChange('category')}
            mode="outlined"
            style={styles.input}
            error={touched.category && !!errors.category}
          />
          <HelperText type="error" visible={touched.category && !!errors.category}>
            {errors.category}
          </HelperText>

          <TextInput
            label="Description"
            value={values.description}
            onChangeText={handleChange('description')}
            mode="outlined"
            style={styles.input}
            error={touched.description && !!errors.description}
          />
          <HelperText type="error" visible={touched.description && !!errors.description}>
            {errors.description}
          </HelperText>

          <TextInput
            label="Date"
            value={values.date}
            onChangeText={handleChange('date')}
            mode="outlined"
            style={styles.input}
            error={touched.date && !!errors.date}
          />
          <HelperText type="error" visible={touched.date && !!errors.date}>
            {errors.date}
          </HelperText>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={onCancel}
              style={styles.button}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit as any}
              style={styles.button}
            >
              Save
            </Button>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 4,
  },
  typeContainer: {
    marginVertical: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  typeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  activeTypeButton: {
    backgroundColor: '#007AFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default TransactionForm;
