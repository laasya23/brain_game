import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserProfile } from '../utils/database';
import { useGame } from '../context/GameContext';
import { Baby, Music, Rocket } from 'lucide-react-native';

const ageBands = [
  { id: '3-5', label: '3-5 years', icon: Baby, color: '#FF6B6B' },
  { id: '6-8', label: '6-8 years', icon: Music, color: '#4ECDC4' },
  { id: '9-10', label: '9-10 years', icon: Rocket, color: '#95E1D3' }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setUserProfile } = useGame();

  async function handleSelectAge(ageBand) {
    try {
      await createUserProfile(ageBand);
      const profile = { age_band: ageBand };
      setUserProfile(profile);
      router.replace('/home');
    } catch (error) {
      console.error('Failed to create profile:', error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Brain Ladder!</Text>
        <Text style={styles.subtitle}>Select your age to get started</Text>
      </View>

      <View style={styles.optionsContainer}>
        {ageBands.map((band) => {
          const Icon = band.icon;
          return (
            <TouchableOpacity
              key={band.id}
              style={[styles.option, { borderColor: band.color }]}
              onPress={() => handleSelectAge(band.id)}
              activeOpacity={0.7}
            >
              <Icon size={48} color={band.color} />
              <Text style={[styles.optionText, { color: band.color }]}>
                {band.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 12
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center'
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    borderWidth: 3,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  optionText: {
    fontSize: 24,
    fontWeight: '700'
  }
});
