import { View, Text, StyleSheet } from 'react-native';

export default function ProgressBar({ current, total, color = '#4ECDC4' }) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.fill,
            { width: `${percentage}%`, backgroundColor: color }
          ]}
        />
      </View>
      <Text style={styles.text}>{current} / {total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 8
  },
  barContainer: {
    width: '100%',
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden'
  },
  fill: {
    height: '100%',
    borderRadius: 6
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333'
  }
});
