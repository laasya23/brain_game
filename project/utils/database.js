import * as SQLite from 'expo-sqlite';

let db = null;

export async function initDatabase() {
  try {
    db = await SQLite.openDatabaseAsync('brainladder.db');

    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        age_band TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS level_progress (
        level_id INTEGER PRIMARY KEY,
        is_unlocked INTEGER DEFAULT 0,
        is_completed INTEGER DEFAULT 0,
        stars INTEGER DEFAULT 0,
        best_score INTEGER DEFAULT 0,
        attempts INTEGER DEFAULT 0,
        last_played TEXT,
        completed_at TEXT
      );

      CREATE TABLE IF NOT EXISTS world_progress (
        world_id INTEGER PRIMARY KEY,
        is_unlocked INTEGER DEFAULT 0,
        total_stars INTEGER DEFAULT 0,
        completed_levels INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS game_settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);

    await ensureLevel1Unlocked();

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

async function ensureLevel1Unlocked() {
  const result = await db.getFirstAsync(
    'SELECT * FROM level_progress WHERE level_id = 1'
  );

  if (!result) {
    await db.runAsync(
      'INSERT INTO level_progress (level_id, is_unlocked) VALUES (1, 1)'
    );
  } else if (!result.is_unlocked) {
    await db.runAsync(
      'UPDATE level_progress SET is_unlocked = 1 WHERE level_id = 1'
    );
  }
}

export async function getUserProfile() {
  const profile = await db.getFirstAsync('SELECT * FROM user_profile LIMIT 1');
  return profile;
}

export async function createUserProfile(ageBand) {
  await db.runAsync(
    'INSERT INTO user_profile (age_band) VALUES (?)',
    [ageBand]
  );
}

export async function getLevelProgress(levelId) {
  let progress = await db.getFirstAsync(
    'SELECT * FROM level_progress WHERE level_id = ?',
    [levelId]
  );

  if (!progress) {
    await db.runAsync(
      'INSERT INTO level_progress (level_id, is_unlocked) VALUES (?, 0)',
      [levelId]
    );
    progress = {
      level_id: levelId,
      is_unlocked: 0,
      is_completed: 0,
      stars: 0,
      best_score: 0,
      attempts: 0
    };
  }

  return progress;
}

export async function getAllLevelProgress() {
  const progress = await db.getAllAsync('SELECT * FROM level_progress');
  return progress || [];
}

export async function updateLevelProgress(levelId, data) {
  const current = await getLevelProgress(levelId);
  const now = new Date().toISOString();

  const updates = {
    is_completed: data.isCompleted !== undefined ? (data.isCompleted ? 1 : 0) : current.is_completed,
    stars: data.stars !== undefined ? Math.max(data.stars, current.stars) : current.stars,
    best_score: data.score !== undefined ? Math.max(data.score, current.best_score) : current.best_score,
    attempts: current.attempts + 1,
    last_played: now,
    completed_at: data.isCompleted ? now : current.completed_at
  };

  await db.runAsync(
    `UPDATE level_progress
     SET is_completed = ?, stars = ?, best_score = ?, attempts = ?, last_played = ?, completed_at = ?
     WHERE level_id = ?`,
    [
      updates.is_completed,
      updates.stars,
      updates.best_score,
      updates.attempts,
      updates.last_played,
      updates.completed_at,
      levelId
    ]
  );

  if (data.isCompleted) {
    await unlockNextLevel(levelId);
  }
}

async function unlockNextLevel(completedLevelId) {
  const nextLevelId = completedLevelId + 1;

  const nextLevel = await db.getFirstAsync(
    'SELECT * FROM level_progress WHERE level_id = ?',
    [nextLevelId]
  );

  if (!nextLevel) {
    await db.runAsync(
      'INSERT INTO level_progress (level_id, is_unlocked) VALUES (?, 1)',
      [nextLevelId]
    );
  } else if (!nextLevel.is_unlocked) {
    await db.runAsync(
      'UPDATE level_progress SET is_unlocked = 1 WHERE level_id = ?',
      [nextLevelId]
    );
  }
}

export async function getWorldProgress(worldId) {
  let progress = await db.getFirstAsync(
    'SELECT * FROM world_progress WHERE world_id = ?',
    [worldId]
  );

  if (!progress) {
    await db.runAsync(
      'INSERT INTO world_progress (world_id, is_unlocked) VALUES (?, ?)',
      [worldId, worldId === 1 ? 1 : 0]
    );
    progress = {
      world_id: worldId,
      is_unlocked: worldId === 1 ? 1 : 0,
      total_stars: 0,
      completed_levels: 0
    };
  }

  return progress;
}

export async function getSetting(key) {
  const result = await db.getFirstAsync(
    'SELECT value FROM game_settings WHERE key = ?',
    [key]
  );
  return result ? result.value : null;
}

export async function setSetting(key, value) {
  await db.runAsync(
    'INSERT OR REPLACE INTO game_settings (key, value) VALUES (?, ?)',
    [key, value]
  );
}

export function getDatabase() {
  return db;
}
