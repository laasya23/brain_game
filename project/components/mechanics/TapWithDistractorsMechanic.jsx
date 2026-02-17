import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import objectsData from '../../data/objects.json';
import ProgressBar from '../game/ProgressBar';

export default function TapWithDistractorsMechanic({ level, onComplete, onFail }) {
  const [targetEmoji, setTargetEmoji] = useState(null);
  const [items, setItems] = useState([]);
  const [progress, setProgress] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateRound();
  }, []);

  function generateRound() {
    const objects = [...objectsData].sort(() => Math.random() - 0.5);
    const target = objects[0];

    const newItems = [];

    for (let i = 0; i < 3; i++) {
      newItems.push({
        id: `correct-${i}`,
        emoji: target.emoji,
        isCorrect: true
      });
    }

    for (let i = 1; i < 16; i++) {
      newItems.push({
        id: `distractor-${i}`,
        emoji: objects[i].emoji,
        isCorrect: false
      });
    }

    setTargetEmoji(target.emoji);
    setItems(newItems.sort(() => Math.random() - 0.5));
  }

  function handleTap(item) {
    if (item.isCorrect) {
      const newProgress = progress + 1;
      const newScore = score + 100;
      setProgress(newProgress);
      setScore(newScore);

      if (newProgress >= level.targetCount) {
        onComplete(newScore);
      } else {
        generateRound();
      }
    } else {
      const newWrong = wrongAttempts + 1;
      setWrongAttempts(newWrong);

      if (newWrong >= level.maxWrongAttempts) {
        onFail();
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.instruction}>
        <Text style={styles.instructionText}>Find all the</Text>
        <Text style={styles.targetEmoji}>{targetEmoji}</Text>
      </View>

      <ProgressBar
        current={progress}
        total={level.targetCount}
        color="#4ECDC4"
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsGrid}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={() => handleTap(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.wrongCounter}>
        <Text style={styles.wrongText}>
          Mistakes: {wrongAttempts} / {level.maxWrongAttempts}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20
  },
  instruction: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  instructionText: {
    fontSize: 20,
    color: '#333333'
  },
  targetEmoji: {
    fontSize: 48,
    marginTop: 8
  },
  scrollView: {
    flex: 1
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    paddingBottom: 20
  },
  item: {
    width: 70,
    height: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2
  },
  emoji: {
    fontSize: 36
  },
  wrongCounter: {
    alignItems: 'center',
    paddingVertical: 12
  },
  wrongText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '600'
  }
});
