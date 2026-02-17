import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colorsData from '../../data/colors.json';
import ShapeComponent from '../game/ShapeComponent';
import ProgressBar from '../game/ProgressBar';

export default function SelectSmallestMechanic({ level, onComplete, onFail }) {
  const [options, setOptions] = useState([]);
  const [smallestId, setSmallestId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateRound();
  }, []);

  function generateRound() {
    const sizes = [50, 70, 90, 110];
    const shuffledSizes = sizes.sort(() => Math.random() - 0.5);
    const smallestSize = Math.min(...shuffledSizes);

    const newOptions = shuffledSizes.map((size, index) => ({
      id: `item-${index}`,
      size,
      color: colorsData[Math.floor(Math.random() * colorsData.length)].hex,
      isSmallest: size === smallestSize
    }));

    setOptions(newOptions);
    setSmallestId(newOptions.find(o => o.isSmallest).id);
  }

  function handleSelect(item) {
    if (item.id === smallestId) {
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
        <Text style={styles.instructionText}>Tap the</Text>
        <Text style={styles.targetText}>SMALLEST</Text>
        <Text style={styles.instructionText}>circle!</Text>
      </View>

      <ProgressBar
        current={progress}
        total={level.targetCount}
        color="#4ECDC4"
      />

      <View style={styles.optionsContainer}>
        {options.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.option}
            onPress={() => handleSelect(item)}
            activeOpacity={0.7}
          >
            <ShapeComponent shape="circle" size={item.size} color={item.color} />
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
    fontSize: 36,
    fontWeight: '800',
    color: '#95E1D3',
    marginVertical: 8
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 40
  },
  option: {
    alignItems: 'center',
    justifyContent: 'center'
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
