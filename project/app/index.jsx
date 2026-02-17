import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../context/GameContext';
import { Sparkles } from 'lucide-react-native';

export default function SplashScreen() {
  const router = useRouter();
  const { isReady, userProfile } = useGame();

  useEffect(() => {
    if (isReady) {
      setTimeout(() => {
        if (userProfile) {
          router.replace('/home');
        } else {
          router.replace('/onboarding');
        }
      }, 1500);
    }
  }, [isReady, userProfile]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Sparkles size={80} color="#FFE66D" />
        <Text style={styles.title}>Brain Ladder</Text>
        <Text style={styles.subtitle}>Saga</Text>
      </View>
      <ActivityIndicator size="large" color="#4ECDC4" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    gap: 8
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 20
  },
  subtitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFE66D'
  },
  loader: {
    marginTop: 40
  }
});
