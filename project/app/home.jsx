import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Map, Play, Settings as SettingsIcon } from 'lucide-react-native';
import { useGame } from '../context/GameContext';
import GameButton from '../components/game/GameButton';

export default function HomeScreen() {
  const router = useRouter();
  const { userProfile, levelProgress, levels } = useGame();

  const getLastPlayedLevel = () => {
    const unlockedLevels = Object.values(levelProgress)
      .filter(p => p.is_unlocked === 1 && p.is_completed === 0);

    if (unlockedLevels.length > 0) {
      return unlockedLevels[0].level_id;
    }

    const completedLevels = Object.values(levelProgress)
      .filter(p => p.is_completed === 1)
      .sort((a, b) => b.level_id - a.level_id);

    if (completedLevels.length > 0) {
      return completedLevels[0].level_id;
    }

    return 1;
  };

  const getTotalStars = () => {
    return Object.values(levelProgress)
      .reduce((sum, p) => sum + (p.stars || 0), 0);
  };

  const getCompletedLevels = () => {
    return Object.values(levelProgress)
      .filter(p => p.is_completed === 1).length;
  };

  function handleContinue() {
    const levelId = getLastPlayedLevel();
    router.push(`/level/${levelId}`);
  }

  function handleWorldMap() {
    router.push('/worlds');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Brain Ladder Saga</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{getTotalStars()}</Text>
          <Text style={styles.statLabel}>Stars</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{getCompletedLevels()}</Text>
          <Text style={styles.statLabel}>Levels</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>1</Text>
          <Text style={styles.statLabel}>Worlds</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.mainButton, styles.playButton]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Play size={32} color="#FFFFFF" fill="#FFFFFF" />
          <Text style={styles.mainButtonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainButton, styles.mapButton]}
          onPress={handleWorldMap}
          activeOpacity={0.8}
        >
          <Map size={32} color="#FFFFFF" />
          <Text style={styles.mainButtonText}>World Map</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Age Group: {userProfile?.age_band}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 24
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
    alignItems: 'center'
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FF6B6B',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 20,
    color: '#666666'
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 15,
    minWidth: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4ECDC4',
    marginBottom: 4
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600'
  },
  actionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 24,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  playButton: {
    backgroundColor: '#FF6B6B'
  },
  mapButton: {
    backgroundColor: '#4ECDC4'
  },
  mainButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20
  },
  footerText: {
    fontSize: 14,
    color: '#999999'
  }
});
