// 存储适配器 - 统一本地存储和 Supabase 的接口
import * as localStorage from './storage';
import * as supabaseStorage from './supabase-storage';

export type StorageMode = 'local' | 'supabase';

let currentMode: StorageMode = 'local';

export function setStorageMode(mode: StorageMode) {
  currentMode = mode;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('storage-mode', mode);
  }
}

export function getStorageMode(): StorageMode {
  if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem('storage-mode');
    if (saved === 'local' || saved === 'supabase') {
      currentMode = saved;
    }
  }
  return currentMode;
}

export interface ScoreHistoryItem {
  id: string;
  type: 'add' | 'subtract';
  itemName: string;
  scoreChange: number;
  scoreBefore: number;
  scoreAfter: number;
  timestamp: number;
}

export async function getCurrentScore(): Promise<number> {
  if (currentMode === 'supabase') {
    return await supabaseStorage.getCurrentScore();
  }
  return localStorage.getCurrentScore();
}

export async function setCurrentScore(score: number): Promise<void> {
  if (currentMode === 'supabase') {
    return await supabaseStorage.setCurrentScore(score);
  }
  localStorage.setCurrentScore(score);
}

export async function getScoreHistory(): Promise<ScoreHistoryItem[]> {
  if (currentMode === 'supabase') {
    return await supabaseStorage.getScoreHistory();
  }
  return localStorage.getScoreHistory();
}

export async function addScoreHistoryItem(item: ScoreHistoryItem): Promise<void> {
  if (currentMode === 'supabase') {
    return await supabaseStorage.addScoreHistoryItem(item);
  }
  localStorage.addScoreHistoryItem(item);
}

export async function clearAllData(): Promise<void> {
  if (currentMode === 'supabase') {
    return await supabaseStorage.clearAllData();
  }
  localStorage.clearAllData();
}
