import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../context/GameContext';
import { Star, Lock, ChevronLeft } from 'lucide-react-native';

export default function WorldsScreen() {
  const router = useRouter();
  const { worlds, levels, levelProgress, isLevelUnlocked, getLevelStars } = useGame();

  function handleLevelPress(levelId) {
    if (isLevelUnlocked(levelId)) {
      router.push(`/level/${levelId}`);
    }
  }

  function handleBack() {
    router.back();
  }

  function getLevelsForWorld(worldId) {
    return levels.filter(l => l.worldId === worldId);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>World Map</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {worlds.map((world) => {
          const worldLevels = getLevelsForWorld(world.id);

          return (
            <View key={world.id} style={styles.worldContainer}>
              <View style={[styles.worldHeader, { backgroundColor: world.color }]}>
                <Text style={styles.worldName}>{world.name}</Text>
                <Text style={styles.worldDesc}>{world.description}</Text>
                {world.isPremium && (
                  <View style={styles.premiumBadge}>
                    <Lock size={16} color="#FFFFFF" />
                    <Text style={styles.premiumText}>Premium</Text>
                  </View>
                )}
              </View>

              <View style={styles.levelsGrid}>
                {worldLevels.map((level) => {
                  const isUnlocked = isLevelUnlocked(level.id);
                  const stars = getLevelStars(level.id);
                  const isCompleted = stars > 0;

                  return (
                    <TouchableOpacity
                      key={level.id}
                      style={[
                        styles.levelButton,
                        !isUnlocked && styles.levelLocked,
                        isCompleted && styles.levelCompleted
                      ]}
                      onPress={() => handleLevelPress(level.id)}
                      disabled={!isUnlocked || world.isPremium}
                      activeOpacity={0.7}
                    >
                      {!isUnlocked || world.isPremium ? (
                        <Lock size={24} color="#CCCCCC" />
                      ) : (
                        <>
                          <Text style={[
                            styles.levelNumber,
                            isCompleted && styles.levelNumberCompleted
                          ]}>
                            {level.number}
                          </Text>
                          {stars > 0 && (
                            <View style={styles.starsContainer}>
                              {[1, 2, 3].map((i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  color="#FFE66D"
                                  fill={i <= stars ? '#FFE66D' : 'transparent'}
                                />
                              ))}
                            </View>
                          )}
                        </>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
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
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  backButton: {
    padding: 8
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  placeholder: {
    width: 44
  },
  scrollView: {
    flex: 1
  },
  worldContainer: {
    marginBottom: 20
  },
  worldHeader: {
    padding: 20,
    alignItems: 'center'
  },
  worldName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4
  },
  worldDesc: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600'
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12
  },
  levelButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4ECDC4',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3
  },
  levelLocked: {
    backgroundColor: '#E0E0E0'
  },
  levelCompleted: {
    backgroundColor: '#95E1D3'
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  levelNumberCompleted: {
    fontSize: 20
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4
  }
});
