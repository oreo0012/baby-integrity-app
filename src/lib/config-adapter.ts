// 配置适配器 - 统一本地配置和 Supabase 配置的接口
import * as localConfig from './config';
import * as supabaseConfig from './supabase-config';
import { getStorageMode } from './storage-adapter';

export interface ScoreItem {
  id: string;
  name: string;
  minScore: number;
  maxScore: number;
}

export interface Reward {
  name: string;
  value: number | boolean;
  unit: string;
}

export async function getAddItems(): Promise<ScoreItem[]> {
  if (getStorageMode() === 'supabase') {
    return await supabaseConfig.getAddItems();
  }
  return localConfig.getAddItems();
}

export async function getSubtractItems(): Promise<ScoreItem[]> {
  if (getStorageMode() === 'supabase') {
    return await supabaseConfig.getSubtractItems();
  }
  return localConfig.getSubtractItems();
}

export async function getRewardsByScore(score: number): Promise<Reward[]> {
  if (getStorageMode() === 'supabase') {
    return await supabaseConfig.getRewardsByScore(score);
  }
  return localConfig.getRewardsByScore(score);
}

export function getRandomScore(item: ScoreItem): number {
  if (getStorageMode() === 'supabase') {
    return supabaseConfig.getRandomScore(item);
  }
  return localConfig.getRandomScore(item);
}
