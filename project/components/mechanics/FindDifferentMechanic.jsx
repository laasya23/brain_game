import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import objectsData from '../../data/objects.json';
import ProgressBar from '../game/ProgressBar';

export default function FindDifferentMechanic({ level, onComplete, onFail }) {
  const [options, setOptions] = useState([]);
  const [differentId, setDifferentId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateRound();
  }, []);

  function generateRound() {
    const objects = objectsData.sort(() => Math.random() - 0.5);
    const sameObject = objects[0];
    const differentObject = objects[1];

    const newOptions = [
      { id: 'diff', emoji: differentObject.emoji, isDifferent: true },
      { id: 'same-1', emoji: sameObject.emoji, isDifferent: false },
      { id: 'same-2', emoji: sameObject.emoji, isDifferent: false },
      { id: 'same-3', emoji: sameObject.emoji, isDifferent: false },
      { id: 'same-4', emoji: sameObject.emoji, isDifferent: false }
    ];

    setOptions(newOptions.sort(() => Math.random() - 0.5));
    setDifferentId('diff');
  }

  function handleSelect(item) {
    if (item.isDifferent) {
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
        <Text style={styles.instructionText}>Find the</Text>
        <Text style={styles.targetText}>ODD ONE OUT</Text>
      </View>

      <ProgressBar
        current={progress}
        total={level.targetCount}
        color="#4ECDC4"
      />

      <View style={styles.optionsGrid}>
        {options.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.option}
            onPress={() => handleSelect(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

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
    gap: 24
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
    fontSize: 24,
    color: '#333333'
  },
  targetText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F38181',
    marginTop: 8
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center'
  },
  option: {
    width: 100,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  emoji: {
    fontSize: 56
  },
  wrongCounter: {
    alignItems: 'center',
    marginTop: 'auto'
  },
  wrongText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '600'
  }
});
