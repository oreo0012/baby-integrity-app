import { getCurrentScore, setCurrentScore, addScoreHistoryItem, type ScoreHistoryItem } from './storage-adapter';
import { getRewardsByScore, getRandomScore, type ScoreItem, type Reward, getAddItems, getSubtractItems } from './config-adapter';

export interface ScoreChangeResult {
  success: boolean;
  scoreBefore: number;
  scoreAfter: number;
  scoreChange: number;
  itemName: string;
}

export async function getCurrentScoreData(): Promise<number> {
  return await getCurrentScore();
}

export async function addScore(item: ScoreItem): Promise<ScoreChangeResult> {
  const scoreBefore = await getCurrentScore();
  const scoreChange = getRandomScore(item);
  const scoreAfter = Math.min(scoreBefore + scoreChange, 100);

  await setCurrentScore(scoreAfter);

  const historyItem: ScoreHistoryItem = {
    id: `history-${Date.now()}`,
    type: 'add',
    itemName: item.name,
    scoreChange,
    scoreBefore,
    scoreAfter,
    timestamp: Date.now(),
  };

  await addScoreHistoryItem(historyItem);

  return {
    success: true,
    scoreBefore,
    scoreAfter,
    scoreChange,
    itemName: item.name,
  };
}

export async function subtractScore(item: ScoreItem): Promise<ScoreChangeResult> {
  const scoreBefore = await getCurrentScore();
  const scoreChange = getRandomScore(item);
  const scoreAfter = Math.max(scoreBefore - scoreChange, 0);

  await setCurrentScore(scoreAfter);

  const historyItem: ScoreHistoryItem = {
    id: `history-${Date.now()}`,
    type: 'subtract',
    itemName: item.name,
    scoreChange,
    scoreBefore,
    scoreAfter,
    timestamp: Date.now(),
  };

  await addScoreHistoryItem(historyItem);

  return {
    success: true,
    scoreBefore,
    scoreAfter,
    scoreChange,
    itemName: item.name,
  };
}

export async function getCurrentRewards(): Promise<Reward[]> {
  const currentScore = await getCurrentScore();
  return await getRewardsByScore(currentScore);
}

export async function getScoreRangeName(): Promise<string> {
  const currentScore = await getCurrentScore();
  
  if (currentScore >= 90) return '优秀';
  if (currentScore >= 60) return '良好';
  return '待提高';
}

export { type ScoreItem, getAddItems, getSubtractItems };
