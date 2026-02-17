import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import objectsData from '../../data/objects.json';
import ProgressBar from '../game/ProgressBar';

export default function MatchPairsMechanic({ level, onComplete, onFail }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateCards();
  }, []);

  function generateCards() {
    const selectedObjects = objectsData
      .sort(() => Math.random() - 0.5)
      .slice(0, level.targetCount);

    const pairs = [];
    selectedObjects.forEach((obj, index) => {
      pairs.push({ id: `${obj.id}-1`, objectId: obj.id, emoji: obj.emoji, pairId: index });
      pairs.push({ id: `${obj.id}-2`, objectId: obj.id, emoji: obj.emoji, pairId: index });
    });

    setCards(pairs.sort(() => Math.random() - 0.5));
  }

  function handleCardTap(card) {
    if (flipped.length >= 2 || flipped.includes(card.id) || matched.includes(card.pairId)) {
      return;
    }

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = cards.find(c => c.id === newFlipped[0]);
      const card2 = cards.find(c => c.id === newFlipped[1]);

      if (card1.pairId === card2.pairId) {
        const newMatched = [...matched, card1.pairId];
        const newScore = score + 100;
        setMatched(newMatched);
        setScore(newScore);
        setFlipped([]);

        if (newMatched.length >= level.targetCount) {
          setTimeout(() => onComplete(newScore), 500);
        }
      } else {
        const newWrong = wrongAttempts + 1;
        setWrongAttempts(newWrong);

        setTimeout(() => {
          setFlipped([]);
        }, 800);

        if (newWrong >= level.maxWrongAttempts) {
          setTimeout(() => onFail(), 1000);
        }
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.instruction}>
        <Text style={styles.instructionText}>Match the pairs!</Text>
      </View>

      <ProgressBar
        current={matched.length}
        total={level.targetCount}
        color="#4ECDC4"
      />

      <View style={styles.cardsGrid}>
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id);
          const isMatched = matched.includes(card.pairId);

          return (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.card,
                (isFlipped || isMatched) && styles.cardFlipped,
                isMatched && styles.cardMatched
              ]}
              onPress={() => handleCardTap(card)}
              activeOpacity={0.7}
              disabled={isMatched}
            >
              {(isFlipped || isMatched) ? (
                <Text style={styles.emoji}>{card.emoji}</Text>
              ) : (
                <Text style={styles.cardBack}>?</Text>
              )}
            </TouchableOpacity>
          );
        })}
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
    fontSize: 28,
    fontWeight: '700',
    color: '#4ECDC4'
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center'
  },
  card: {
    width: 80,
    height: 80,
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3
  },
  cardFlipped: {
    backgroundColor: '#FFFFFF'
  },
  cardMatched: {
    backgroundColor: '#95E1D3'
  },
  cardBack: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  emoji: {
    fontSize: 40
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
