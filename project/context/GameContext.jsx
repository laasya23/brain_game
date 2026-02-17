import { createContext, useContext, useState, useEffect } from 'react';
import { initDatabase, getUserProfile, getLevelProgress, getAllLevelProgress } from '../utils/database';
import worldsData from '../data/worlds.json';
import levelsData from '../data/levels.json';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [isReady, setIsReady] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [worlds, setWorlds] = useState(worldsData);
  const [levels, setLevels] = useState(levelsData);
  const [levelProgress, setLevelProgress] = useState({});

  useEffect(() => {
    initializeGame();
  }, []);

  async function initializeGame() {
    try {
      await initDatabase();
      const profile = await getUserProfile();
      setUserProfile(profile);

      const progress = await getAllLevelProgress();
      const progressMap = {};
      progress.forEach(p => {
        progressMap[p.level_id] = p;
      });
      setLevelProgress(progressMap);

      setIsReady(true);
    } catch (error) {
      console.error('Failed to initialize game:', error);
    }
  }

  async function refreshProgress() {
    const progress = await getAllLevelProgress();
    const progressMap = {};
    progress.forEach(p => {
      progressMap[p.level_id] = p;
    });
    setLevelProgress(progressMap);
  }

  function getLevelData(levelId) {
    return levels.find(l => l.id === levelId);
  }

  function getWorldData(worldId) {
    return worlds.find(w => w.id === worldId);
  }

  function isLevelUnlocked(levelId) {
    return levelProgress[levelId]?.is_unlocked === 1;
  }

  function isLevelCompleted(levelId) {
    return levelProgress[levelId]?.is_completed === 1;
  }

  function getLevelStars(levelId) {
    return levelProgress[levelId]?.stars || 0;
  }

  const value = {
    isReady,
    userProfile,
    setUserProfile,
    worlds,
    levels,
    levelProgress,
    refreshProgress,
    getLevelData,
    getWorldData,
    isLevelUnlocked,
    isLevelCompleted,
    getLevelStars
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
