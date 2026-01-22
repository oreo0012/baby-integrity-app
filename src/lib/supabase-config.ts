import { supabase, type ScoreItemRecord, type ScoreRangeRecord } from './supabase';

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

export interface ScoreRange {
  name: string;
  minScore: number;
  maxScore: number;
  rewards: {
    freeTime: Reward;
    spendingLimit: Reward;
    weeklyAllowance: Reward;
    weekendGame: Reward;
  };
}

// 缓存配置数据
let cachedAddItems: ScoreItem[] | null = null;
let cachedSubtractItems: ScoreItem[] | null = null;
let cachedScoreRanges: ScoreRange[] | null = null;

// 获取加分项
export async function getAddItems(): Promise<ScoreItem[]> {
  if (cachedAddItems) {
    return cachedAddItems;
  }

  const { data, error } = await supabase
    .from('score_items')
    .select('*')
    .eq('type', 'add')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('Error fetching add items:', error);
    return [];
  }

  cachedAddItems = data.map((item: ScoreItemRecord) => ({
    id: item.id,
    name: item.name,
    minScore: item.min_score,
    maxScore: item.max_score,
  }));

  return cachedAddItems;
}

// 获取扣分项
export async function getSubtractItems(): Promise<ScoreItem[]> {
  if (cachedSubtractItems) {
    return cachedSubtractItems;
  }

  const { data, error } = await supabase
    .from('score_items')
    .select('*')
    .eq('type', 'subtract')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('Error fetching subtract items:', error);
    return [];
  }

  cachedSubtractItems = data.map((item: ScoreItemRecord) => ({
    id: item.id,
    name: item.name,
    minScore: item.min_score,
    maxScore: item.max_score,
  }));

  return cachedSubtractItems;
}

// 获取信用分段配置
export async function getScoreRanges(): Promise<ScoreRange[]> {
  if (cachedScoreRanges) {
    return cachedScoreRanges;
  }

  const { data, error } = await supabase
    .from('score_ranges')
    .select('*')
    .order('min_score', { ascending: false });

  if (error) {
    console.error('Error fetching score ranges:', error);
    return [];
  }

  cachedScoreRanges = data.map((range: ScoreRangeRecord) => ({
    name: range.name,
    minScore: range.min_score,
    maxScore: range.max_score,
    rewards: {
      freeTime: {
        name: '每日自由支配时间',
        value: range.free_time_value,
        unit: '分钟',
      },
      spendingLimit: {
        name: '每日手表消费额度',
        value: range.spending_limit_value,
        unit: '元',
      },
      weeklyAllowance: {
        name: '每周获得零花钱',
        value: range.weekly_allowance_value,
        unit: '元',
      },
      weekendGame: {
        name: '周末游戏时间',
        value: range.weekend_game_value,
        unit: '',
      },
    },
  }));

  return cachedScoreRanges;
}

// 根据分数获取权益
export async function getRewardsByScore(score: number): Promise<Reward[]> {
  const ranges = await getScoreRanges();
  const range = ranges.find(r => score >= r.minScore && score <= r.maxScore);
  
  if (!range) {
    return [];
  }

  return Object.values(range.rewards);
}

// 获取随机分数
export function getRandomScore(item: ScoreItem): number {
  return Math.floor(Math.random() * (item.maxScore - item.minScore + 1)) + item.minScore;
}

// 清除缓存（用于刷新配置）
export function clearConfigCache(): void {
  cachedAddItems = null;
  cachedSubtractItems = null;
  cachedScoreRanges = null;
}
