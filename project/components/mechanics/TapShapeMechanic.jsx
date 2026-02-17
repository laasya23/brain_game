import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import shapesData from '../../data/shapes.json';
import colorsData from '../../data/colors.json';
import ShapeComponent from '../game/ShapeComponent';
import ProgressBar from '../game/ProgressBar';

export default function TapShapeMechanic({ level, onComplete, onFail }) {
  const [targetShape] = useState('circle');
  const [shapes, setShapes] = useState([]);
  const [progress, setProgress] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateRound();
  }, []);

  function generateRound() {
    const newShapes = [];
    const circleCount = 3;
    const otherCount = 6;

    for (let i = 0; i < circleCount; i++) {
      newShapes.push({
        id: `circle-${i}`,
        shape: 'circle',
        color: colorsData[Math.floor(Math.random() * colorsData.length)].hex
      });
    }

    const otherShapes = shapesData.filter(s => s.id !== 'circle');
    for (let i = 0; i < otherCount; i++) {
      const shape = otherShapes[Math.floor(Math.random() * otherShapes.length)];
      newShapes.push({
        id: `${shape.id}-${i}`,
        shape: shape.id,
        color: colorsData[Math.floor(Math.random() * colorsData.length)].hex
      });
    }

    setShapes(newShapes.sort(() => Math.random() - 0.5));
  }

  function handleShapeTap(item) {
    if (item.shape === targetShape) {
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
        <Text style={styles.instructionText}>Tap all the</Text>
        <Text style={styles.shapeName}>Circles</Text>
      </View>

      <ProgressBar
        current={progress}
        total={level.targetCount}
        color="#4ECDC4"
      />

      <View style={styles.shapesGrid}>
        {shapes.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.shapeContainer}
            onPress={() => handleShapeTap(item)}
            activeOpacity={0.7}
          >
            <ShapeComponent shape={item.shape} size={70} color={item.color} />
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
  shapeName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4ECDC4',
    marginTop: 8
  },
  shapesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center'
  },
  shapeContainer: {
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
