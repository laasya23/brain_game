import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colorsData from '../../data/colors.json';
import ProgressBar from '../game/ProgressBar';
import GameTimer from '../game/GameTimer';

export default function TapColorTimedMechanic({ level, onComplete, onFail }) {
  const [targetColor, setTargetColor] = useState(null);
  const [options, setOptions] = useState([]);
  const [progress, setProgress] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    generateRound();
  }, []);

  function generateRound() {
    const shuffled = [...colorsData].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    const opts = shuffled.slice(0, 6);

    setTargetColor(target);
    setOptions(opts.sort(() => Math.random() - 0.5));
  }

  function handleColorTap(color) {
    if (!isActive) return;

    if (color.id === targetColor.id) {
      const newProgress = progress + 1;
      const newScore = score + 100;
      setProgress(newProgress);
      setScore(newScore);

      if (newProgress >= level.targetCount) {
        setIsActive(false);
        onComplete(newScore);
      } else {
        generateRound();
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

      <View style={styles.instruction}>
        <Text style={styles.instructionText}>Tap the</Text>
        <Text style={[styles.colorName, { color: targetColor?.hex }]}>
          {targetColor?.name}
        </Text>
        <Text style={styles.instructionText}>color!</Text>
      </View>

      <ProgressBar
        current={progress}
        total={level.targetCount}
        color="#4ECDC4"
      />

      <View style={styles.optionsGrid}>
        {options.map((color) => (
          <TouchableOpacity
            key={color.id}
            style={[styles.colorBox, { backgroundColor: color.hex }]}
            onPress={() => handleColorTap(color)}
            activeOpacity={0.7}
            disabled={!isActive}
          />
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
  colorName: {
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 8
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center'
  },
  colorBox: {
    width: 100,
    height: 100,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4
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
