const STORAGE_KEYS = {
  CURRENT_SCORE: 'baby-integrity-current-score',
  SCORE_HISTORY: 'baby-integrity-score-history',
};

export interface ScoreHistoryItem {
  id: string;
  type: 'add' | 'subtract';
  itemName: string;
  scoreChange: number;
  scoreBefore: number;
  scoreAfter: number;
  timestamp: number;
}

export function getCurrentScore(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_SCORE);
    return stored ? parseInt(stored, 10) : 100;
  } catch (error) {
    console.error('Error reading current score from storage:', error);
    return 100;
  }
}

export function setCurrentScore(score: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SCORE, score.toString());
  } catch (error) {
    console.error('Error saving current score to storage:', error);
  }
}

export function getScoreHistory(): ScoreHistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SCORE_HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading score history from storage:', error);
    return [];
  }
}

export function addScoreHistoryItem(item: ScoreHistoryItem): void {
  try {
    const history = getScoreHistory();
    history.unshift(item);
    localStorage.setItem(STORAGE_KEYS.SCORE_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error adding score history item to storage:', error);
  }
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SCORE);
    localStorage.removeItem(STORAGE_KEYS.SCORE_HISTORY);
  } catch (error) {
    console.error('Error clearing data from storage:', error);
  }
}
