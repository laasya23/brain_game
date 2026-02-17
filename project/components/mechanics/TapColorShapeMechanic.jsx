import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import shapesData from '../../data/shapes.json';
import colorsData from '../../data/colors.json';
import ShapeComponent from '../game/ShapeComponent';
import ProgressBar from '../game/ProgressBar';

export default function TapColorShapeMechanic({ level, onComplete, onFail }) {
  const [targetColor] = useState(colorsData.find(c => c.id === 'red'));
  const [targetShape] = useState('circle');
  const [items, setItems] = useState([]);
  const [progress, setProgress] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateRound();
  }, []);

  function generateRound() {
    const newItems = [];

    for (let i = 0; i < 3; i++) {
      newItems.push({
        id: `correct-${i}`,
        shape: targetShape,
        color: targetColor.hex,
        isCorrect: true
      });
    }

    const shapes = shapesData.map(s => s.id);
    const colors = colorsData.map(c => c.hex);

    for (let i = 0; i < 9; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];

      if (shape === targetShape && color === targetColor.hex) {
        continue;
      }

      newItems.push({
        id: `wrong-${i}`,
        shape,
        color,
        isCorrect: false
      });
    }

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
        <Text style={styles.instructionText}>Tap only the</Text>
        <View style={styles.targetContainer}>
          <Text style={[styles.colorName, { color: targetColor.hex }]}>
            RED
          </Text>
          <Text style={styles.shapeName}>CIRCLES</Text>
        </View>
      </View>

      <ProgressBar
        current={progress}
        total={level.targetCount}
        color="#4ECDC4"
      />

      <View style={styles.itemsGrid}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            onPress={() => handleTap(item)}
            activeOpacity={0.7}
          >
            <ShapeComponent shape={item.shape} size={60} color={item.color} />
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
  targetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8
  },
  colorName: {
    fontSize: 28,
    fontWeight: '800'
  },
  shapeName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4ECDC4'
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center'
  },
  item: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3
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
