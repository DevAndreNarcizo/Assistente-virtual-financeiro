import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Chip, ProgressBar, IconButton, Portal, Modal, Button } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../store';
import { EducationalResource, toggleResourceCompletion } from '../store/slices/educationSlice';

const EducationScreen = () => {
  const [selectedResource, setSelectedResource] = useState<EducationalResource | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useAppDispatch();
  const resources = useAppSelector(state => state.education.resources);

  const getDifficultyColor = (difficulty: EducationalResource['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FFA726';
      case 'advanced': return '#F44336';
      default: return '#000000';
    }
  };

  const calculateProgress = () => {
    const completed = resources.filter(r => r.isCompleted).length;
    return {
      completed,
      total: resources.length,
      percentage: (completed / resources.length) * 100
    };
  };

  const filterResourcesByCategory = (category: EducationalResource['category']) => {
    return resources.filter(r => r.category === category);
  };

  const renderResourceCard = (resource: EducationalResource) => (
    <Card
      key={resource.id}
      style={[styles.resourceCard, resource.isCompleted && styles.completedCard]}
      onPress={() => {
        setSelectedResource(resource);
        setIsModalVisible(true);
      }}
    >
      <Card.Content>
        <View style={styles.resourceHeader}>
          <View style={styles.titleContainer}>
            <Text variant="titleMedium" style={resource.isCompleted && styles.completedText}>
              {resource.title}
            </Text>
            <View style={styles.chipContainer}>
              <Chip
                style={[
                  styles.difficultyChip,
                  { backgroundColor: getDifficultyColor(resource.difficulty) }
                ]}
                textStyle={styles.chipText}
              >
                {resource.difficulty}
              </Chip>
              <Chip style={styles.timeChip}>
                {resource.timeToRead} min read
              </Chip>
            </View>
          </View>
          <IconButton
            icon={resource.isCompleted ? "check-circle" : "circle-outline"}
            size={24}
            onPress={() => dispatch(toggleResourceCompletion(resource.id))}
            iconColor={resource.isCompleted ? '#4CAF50' : '#666'}
          />
        </View>
      </Card.Content>
    </Card>
  );

  const renderCategorySection = (category: EducationalResource['category']) => {
    const categoryResources = filterResourcesByCategory(category);
    if (categoryResources.length === 0) return null;

    return (
      <View style={styles.categorySection}>
        <Text variant="titleLarge" style={styles.categoryTitle}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Text>
        {categoryResources.map(renderResourceCard)}
      </View>
    );
  };

  const { completed, total, percentage } = calculateProgress();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.progressCard}>
          <Card.Content>
            <Text variant="titleLarge">Learning Progress</Text>
            <View style={styles.progressContainer}>
              <ProgressBar
                progress={percentage / 100}
                color="#4CAF50"
                style={styles.progressBar}
              />
              <Text variant="bodyMedium" style={styles.progressText}>
                {completed} of {total} topics completed ({percentage.toFixed(1)}%)
              </Text>
            </View>
          </Card.Content>
        </Card>

        {['basics', 'budgeting', 'saving', 'investing', 'debt', 'taxes', 'retirement'].map(
          category => renderCategorySection(category as EducationalResource['category'])
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => {
            setIsModalVisible(false);
            setSelectedResource(null);
          }}
          contentContainerStyle={styles.modalContainer}
        >
          {selectedResource && (
            <Card>
              <Card.Content>
                <Text variant="titleLarge" style={styles.modalTitle}>
                  {selectedResource.title}
                </Text>
                
                <View style={styles.modalChips}>
                  <Chip
                    style={[
                      styles.difficultyChip,
                      { backgroundColor: getDifficultyColor(selectedResource.difficulty) }
                    ]}
                    textStyle={styles.chipText}
                  >
                    {selectedResource.difficulty}
                  </Chip>
                  <Chip style={styles.timeChip}>
                    {selectedResource.timeToRead} min read
                  </Chip>
                </View>

                <Text variant="bodyLarge" style={styles.contentText}>
                  {selectedResource.content}
                </Text>

                <Button
                  mode="contained"
                  onPress={() => dispatch(toggleResourceCompletion(selectedResource.id))}
                  style={styles.markButton}
                >
                  {selectedResource.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                </Button>
              </Card.Content>
            </Card>
          )}
        </Modal>
      </Portal>
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
  progressCard: {
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    marginBottom: 12,
  },
  resourceCard: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  completedCard: {
    opacity: 0.8,
    backgroundColor: '#f8f8f8',
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  completedText: {
    color: '#666',
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  difficultyChip: {
    marginRight: 8,
  },
  timeChip: {
    backgroundColor: '#E0E0E0',
  },
  chipText: {
    color: '#fff',
  },
  modalContainer: {
    padding: 20,
    margin: 20,
  },
  modalTitle: {
    marginBottom: 16,
  },
  modalChips: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  contentText: {
    lineHeight: 24,
    marginBottom: 24,
  },
  markButton: {
    marginTop: 8,
  },
});

export default EducationScreen;
