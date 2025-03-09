import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Button, ProgressBar, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

interface FinancialQuestion {
  id: string;
  question: string;
  type: 'number' | 'text';
  placeholder: string;
  validation: any;
}

const questions: FinancialQuestion[] = [
  {
    id: 'monthlyIncome',
    question: 'What is your monthly income?',
    type: 'number',
    placeholder: 'Enter amount',
    validation: Yup.number()
      .required('Income is required')
      .min(0, 'Income must be positive')
  },
  {
    id: 'monthlyExpenses',
    question: 'What are your total monthly expenses?',
    type: 'number',
    placeholder: 'Enter amount',
    validation: Yup.number()
      .required('Expenses amount is required')
      .min(0, 'Expenses must be positive')
  },
  {
    id: 'savings',
    question: 'How much do you save monthly?',
    type: 'number',
    placeholder: 'Enter amount',
    validation: Yup.number()
      .required('Savings amount is required')
      .min(0, 'Savings must be positive')
  },
  {
    id: 'debts',
    question: 'What is your total debt?',
    type: 'number',
    placeholder: 'Enter amount',
    validation: Yup.number()
      .required('Debt amount is required')
      .min(0, 'Debt must be positive')
  }
];

const validationSchema = Yup.object().shape(
  questions.reduce((acc, question) => ({
    ...acc,
    [question.id]: question.validation
  }), {})
);

const FinancialDiagnosisScreen = () => {
  const [showResults, setShowResults] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);

  const calculateFinancialHealth = (values: any) => {
    const monthlyIncome = parseFloat(values.monthlyIncome);
    const monthlyExpenses = parseFloat(values.monthlyExpenses);
    const savings = parseFloat(values.savings);
    const debts = parseFloat(values.debts);

    // Calculate key financial metrics
    const savingsRate = (savings / monthlyIncome) * 100;
    const debtToIncomeRatio = (debts / (monthlyIncome * 12)) * 100;
    const expenseRatio = (monthlyExpenses / monthlyIncome) * 100;

    return {
      savingsRate,
      debtToIncomeRatio,
      expenseRatio,
      recommendations: [
        savingsRate < 20 ? 'Try to increase your savings rate to at least 20% of your income.' : 'Great savings rate!',
        debtToIncomeRatio > 40 ? 'Your debt-to-income ratio is high. Consider debt consolidation or accelerated payments.' : 'Your debt level is manageable.',
        expenseRatio > 70 ? 'Your expenses are high relative to income. Look for areas to reduce spending.' : 'Your expense management is good.'
      ]
    };
  };

  const handleSubmit = (values: any) => {
    const results = calculateFinancialHealth(values);
    setDiagnosticResults(results);
    setShowResults(true);
  };

  const renderResults = () => {
    if (!diagnosticResults) return null;

    return (
      <Card style={styles.resultsCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.resultTitle}>Financial Health Analysis</Text>
          
          <View style={styles.metricContainer}>
            <Text variant="titleMedium">Savings Rate</Text>
            <ProgressBar 
              progress={diagnosticResults.savingsRate / 100} 
              color={diagnosticResults.savingsRate >= 20 ? '#4CAF50' : '#FFC107'} 
              style={styles.progressBar} 
            />
            <Text>{diagnosticResults.savingsRate.toFixed(1)}%</Text>
          </View>

          <View style={styles.metricContainer}>
            <Text variant="titleMedium">Debt-to-Income Ratio</Text>
            <ProgressBar 
              progress={diagnosticResults.debtToIncomeRatio / 100} 
              color={diagnosticResults.debtToIncomeRatio <= 40 ? '#4CAF50' : '#F44336'} 
              style={styles.progressBar} 
            />
            <Text>{diagnosticResults.debtToIncomeRatio.toFixed(1)}%</Text>
          </View>

          <View style={styles.metricContainer}>
            <Text variant="titleMedium">Expense Ratio</Text>
            <ProgressBar 
              progress={diagnosticResults.expenseRatio / 100} 
              color={diagnosticResults.expenseRatio <= 70 ? '#4CAF50' : '#FFC107'} 
              style={styles.progressBar} 
            />
            <Text>{diagnosticResults.expenseRatio.toFixed(1)}%</Text>
          </View>

          <View style={styles.recommendationsContainer}>
            <Text variant="titleMedium" style={styles.recommendationsTitle}>
              Recommendations
            </Text>
            {diagnosticResults.recommendations.map((recommendation: string, index: number) => (
              <Text key={index} style={styles.recommendation}>• {recommendation}</Text>
            ))}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {!showResults ? (
        <Formik
          initialValues={questions.reduce((acc, question) => ({
            ...acc,
            [question.id]: ''
          }), {})}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View>
              {questions.map((question) => (
                <Card key={question.id} style={styles.questionCard}>
                  <Card.Content>
                    <Text variant="titleMedium" style={styles.question}>
                      {question.question}
                    </Text>
                    <TextInput
                      mode="outlined"
                      keyboardType={question.type === 'number' ? 'numeric' : 'default'}
                      placeholder={question.placeholder}
                      value={values[question.id]}
                      onChangeText={handleChange(question.id)}
                      error={touched[question.id] && errors[question.id] ? true : false}
                    />
                    {touched[question.id] && errors[question.id] && (
                      <Text style={styles.errorText}>{errors[question.id]}</Text>
                    )}
                  </Card.Content>
                </Card>
              ))}
              <Button
                mode="contained"
                onPress={handleSubmit as any}
                style={styles.submitButton}
              >
                Analyze My Finances
              </Button>
            </View>
          )}
        </Formik>
      ) : (
        <>
          {renderResults()}
          <Button
            mode="outlined"
            onPress={() => setShowResults(false)}
            style={styles.backButton}
          >
            Start New Analysis
          </Button>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  questionCard: {
    marginBottom: 16,
  },
  question: {
    marginBottom: 12,
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 32,
  },
  backButton: {
    marginTop: 16,
    marginBottom: 32,
  },
  resultsCard: {
    marginBottom: 16,
  },
  resultTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  metricContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    marginVertical: 8,
  },
  recommendationsContainer: {
    marginTop: 24,
  },
  recommendationsTitle: {
    marginBottom: 12,
  },
  recommendation: {
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default FinancialDiagnosisScreen;
