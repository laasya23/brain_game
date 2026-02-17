import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGame } from '../../context/GameContext';
import { updateLevelProgress } from '../../utils/database';
import { ChevronLeft, X, Star } from 'lucide-react-native';
import GameButton from '../../components/game/GameButton';
import TapColorMechanic from '../../components/mechanics/TapColorMechanic';
import TapShapeMechanic from '../../components/mechanics/TapShapeMechanic';
import SelectBiggestMechanic from '../../components/mechanics/SelectBiggestMechanic';
import SelectSmallestMechanic from '../../components/mechanics/SelectSmallestMechanic';
import MatchPairsMechanic from '../../components/mechanics/MatchPairsMechanic';
import FindDifferentMechanic from '../../components/mechanics/FindDifferentMechanic';
import TapColorShapeMechanic from '../../components/mechanics/TapColorShapeMechanic';
import TapColorTimedMechanic from '../../components/mechanics/TapColorTimedMechanic';
import TapWithDistractorsMechanic from '../../components/mechanics/TapWithDistractorsMechanic';
import BossMixedMechanic from '../../components/mechanics/BossMixedMechanic';

export default function LevelScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const levelId = parseInt(id);

  const { getLevelData, refreshProgress } = useGame();
  const level = getLevelData(levelId);

  const [gameState, setGameState] = useState('playing');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  if (!level) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Level not found</Text>
      </View>
    );
  }

  function handleLevelComplete(finalScore) {
    const stars = calculateStars(finalScore, level);
    setScore(finalScore);
    setGameState('success');
    setShowResult(true);

    updateLevelProgress(levelId, {
      isCompleted: true,
      score: finalScore,
      stars: stars
    }).then(() => {
      refreshProgress();
    });
  }

  function handleLevelFail() {
    setGameState('failure');
    setShowResult(true);

    updateLevelProgress(levelId, {
      isCompleted: false,
      score: 0,
      stars: 0
    });
  }

  function handleRetry() {
    setShowResult(false);
    setGameState('playing');
    setScore(0);
  }

  function handleExit() {
    router.back();
  }

  function handleNext() {
    const nextLevelId = levelId + 1;
    const nextLevel = getLevelData(nextLevelId);
    if (nextLevel) {
      router.replace(`/level/${nextLevelId}`);
      setShowResult(false);
      setGameState('playing');
      setScore(0);
    } else {
      router.back();
    }
  }

  function calculateStars(finalScore, level) {
    const perfectScore = level.targetCount * 100;
    const percentage = (finalScore / perfectScore) * 100;

    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    return 1;
  }

  function renderMechanic() {
    const props = {
      level,
      onComplete: handleLevelComplete,
      onFail: handleLevelFail
    };

    switch (level.mechanicType) {
      case 'tap-color':
        return <TapColorMechanic {...props} />;
      case 'tap-shape':
        return <TapShapeMechanic {...props} />;
      case 'select-biggest':
        return <SelectBiggestMechanic {...props} />;
      case 'select-smallest':
        return <SelectSmallestMechanic {...props} />;
      case 'match-pairs':
        return <MatchPairsMechanic {...props} />;
      case 'find-different':
        return <FindDifferentMechanic {...props} />;
      case 'tap-color-shape':
        return <TapColorShapeMechanic {...props} />;
      case 'tap-color-timed':
        return <TapColorTimedMechanic {...props} />;
      case 'tap-with-distractors':
        return <TapWithDistractorsMechanic {...props} />;
      case 'boss-mixed':
        return <BossMixedMechanic {...props} />;
      default:
        return <Text>Unknown mechanic</Text>;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
          <X size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.levelTitle}>Level {level.number}</Text>
          <Text style={styles.levelName}>{level.name}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.gameContainer}>
        {renderMechanic()}
      </View>

      <Modal
        visible={showResult}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.resultContainer}>
            {gameState === 'success' ? (
              <>
                <Text style={styles.resultTitle}>Amazing!</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3].map((i) => (
                    <Star
                      key={i}
                      size={48}
                      color="#FFE66D"
                      fill={i <= calculateStars(score, level) ? '#FFE66D' : 'transparent'}
                    />
                  ))}
                </View>
                <Text style={styles.scoreText}>Score: {score}</Text>
                <View style={styles.buttonRow}>
                  <GameButton
                    title="Next"
                    onPress={handleNext}
                    variant="success"
                  />
                  <GameButton
                    title="Exit"
                    onPress={handleExit}
                    variant="secondary"
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.resultTitle}>Try Again!</Text>
                <Text style={styles.resultSubtext}>You can do it!</Text>
                <View style={styles.buttonRow}>
                  <GameButton
                    title="Retry"
                    onPress={handleRetry}
                    variant="primary"
                  />
                  <GameButton
                    title="Exit"
                    onPress={handleExit}
                    variant="secondary"
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FF6B6B',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20
  },
  exitButton: {
    padding: 8
  },
  headerCenter: {
    alignItems: 'center'
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9
  },
  levelName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  placeholder: {
    width: 44
  },
  gameContainer: {
    flex: 1,
    padding: 20
  },
  errorText: {
    fontSize: 18,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 100
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  resultContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    minWidth: 300,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  resultTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#4ECDC4',
    marginBottom: 20
  },
  resultSubtext: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 24
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 24
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12
  }
});
