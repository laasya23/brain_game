import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';

export default function GameTimer({ duration, onTimeUp, isActive = true }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft <= 0) {
      onTimeUp && onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp && onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isActive, onTimeUp]);

  const isLowTime = timeLeft <= 10;

  return (
    <View style={[styles.container, isLowTime && styles.lowTime]}>
      <Clock size={20} color={isLowTime ? '#FF6B6B' : '#4ECDC4'} />
      <Text style={[styles.time, isLowTime && styles.lowTimeText]}>
        {timeLeft}s
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  lowTime: {
    backgroundColor: '#FFE5E5'
  },
  time: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4ECDC4'
  },
  lowTimeText: {
    color: '#FF6B6B'
  }
});
