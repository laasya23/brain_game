import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colorsData from '../../data/colors.json';
import shapesData from '../../data/shapes.json';
import ShapeComponent from '../game/ShapeComponent';
import GameTimer from '../game/GameTimer';

const challenges = [
  { type: 'color', instruction: 'Tap the BLUE color' },
  { type: 'shape', instruction: 'Tap the STAR shape' },
  { type: 'size', instruction: 'Tap the BIGGEST circle' }
];

export default function BossMixedMechanic({ level, onComplete, onFail }) {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [options, setOptions] = useState([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    generateChallenge(currentChallenge);
  }, [currentChallenge]);

  function generateChallenge(index) {
    const challenge = challenges[index];

    switch (challenge.type) {
      case 'color':
        generateColorChallenge();
        break;
      case 'shape':
        generateShapeChallenge();
        break;
      case 'size':
        generateSizeChallenge();
        break;
    }
  }

  function generateColorChallenge() {
    const blue = colorsData.find(c => c.id === 'blue');
    const others = colorsData.filter(c => c.id !== 'blue').slice(0, 5);
    const opts = [blue, ...others].sort(() => Math.random() - 0.5);

    setOptions(opts.map((c, i) => ({
      id: `color-${i}`,
      type: 'color',
      color: c.hex,
      isCorrect: c.id === 'blue'
    })));
  }

  function generateShapeChallenge() {
    const star = shapesData.find(s => s.id === 'star');
    const others = shapesData.filter(s => s.id !== 'star').slice(0, 5);
    const opts = [star, ...others].sort(() => Math.random() - 0.5);

    setOptions(opts.map((s, i) => ({
      id: `shape-${i}`,
      type: 'shape',
      shape: s.id,
      color: colorsData[Math.floor(Math.random() * colorsData.length)].hex,
      isCorrect: s.id === 'star'
    })));
  }

  function generateSizeChallenge() {
    const sizes = [50, 70, 90, 110];
    const shuffled = sizes.sort(() => Math.random() - 0.5);
    const biggest = Math.max(...shuffled);

    setOptions(shuffled.map((size, i) => ({
      id: `size-${i}`,
      type: 'size',
      size,
      color: colorsData[Math.floor(Math.random() * colorsData.length)].hex,
      isCorrect: size === biggest
    })));
  }

  function handleSelect(item) {
    if (!isActive) return;

    if (item.isCorrect) {
      const newChallenge = currentChallenge + 1;
      const newScore = score + 100;
      setScore(newScore);

      if (newChallenge >= level.targetCount) {
        setIsActive(false);
        onComplete(newScore);
      } else {
        setCurrentChallenge(newChallenge);
      }
    } else {
      const newWrong = wrongAttempts + 1;
      setWrongAttempts(newWrong);

      if (newWrong >= level.maxWrongAttempts) {
        setIsActive(false);
        onFail();
      }
    }
  }

  function handleTimeUp() {
    setIsActive(false);
    onFail();
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <GameTimer
          duration={level.timeLimit}
          onTimeUp={handleTimeUp}
          isActive={isActive}
        />
      </View>

      <View style={styles.challengeInfo}>
        <Text style={styles.challengeNumber}>
          Challenge {currentChallenge + 1} / {level.targetCount}
        </Text>
        <View style={styles.instruction}>
          <Text style={styles.instructionText}>
            {challenges[currentChallenge]?.instruction}
          </Text>
        </View>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.option}
            onPress={() => handleSelect(item)}
            activeOpacity={0.7}
            disabled={!isActive}
          >
            {item.type === 'color' && (
              <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            )}
            {item.type === 'shape' && (
              <ShapeComponent shape={item.shape} size={60} color={item.color} />
            )}
            {item.type === 'size' && (
              <ShapeComponent shape="circle" size={item.size} color={item.color} />
            )}
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
  topBar: {
    alignItems: 'center'
  },
  challengeInfo: {
    gap: 12
  },
  challengeNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B6B',
    textAlign: 'center'
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
    fontWeight: '700',
    color: '#4ECDC4',
    textAlign: 'center'
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
    paddingVertical: 20
  },
  option: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3
  },
  colorBox: {
    width: 80,
    height: 80,
    borderRadius: 12
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
